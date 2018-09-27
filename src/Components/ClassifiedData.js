import React, { Component } from 'react';
import './style.css';
import {tokenizer}from './TrainClassifier';

class ClassifiedData extends Component{
    constructor(props){
        super(props)
        this.state = {
            isTrained : false,
            startTraining: false,
            data: '',
            dataEdited: '',
            isLoading: false,
            resultClass: '',
            resultAccuracy: '',
        }
    }

    startTrain = () => {
        this.setState({
            isTrained: false
        })
    }

    setData = (e) => {
        this.setState({data: e.target.value})
    }

    classifyData = () => {
        let { isLoading } = this.state;
        isLoading=false;
        var text = this.state.data;
        console.log('text',text);
        var xs = tokenizer.texts_to_matrix([text], 'tfidf');
        console.log('xs result',xs);
        this.props.getClassifyResult(xs).then((result) => {
            isLoading=true;
            console.log('here is the result',result);
            this.setState({
                resultClass: result.resultClass,
                resultAccuracy: result.resultAccuracy,
            })
        }).catch((err) => {
            
        });
        this.setState({isLoading});
    }

    render() {
        let renderElement = null;
        if(this.props.triggerClassifierResult === true && this.props.resultAttained === true){
            renderElement = (
                <div>
                    <textarea placeholder="Enter your sentence here" className = "input-textarea" value={this.state.data} onChange={this.setData}>
                        Write sentence to be analysed
                    </textarea>
                    <div >
                        <button style={{margin: '30px auto'}} className = "btn btn-primary btn-lg" onClick={this.classifyData}>
                            Classify
                        </button>
                        <div className="result primary-text">Result</div>
                        <div className = "result-container">
                            <div className="btn result-class" style= {{margin: '5px'}}>{this.state.resultClass}</div>
                            <div className="btn result-confidence" style= {{margin: '5px'}}>{this.state.resultAccuracy}</div>
                        </div>
                    </div>
                </div>
            )
        }

        else if(this.props.triggerClassifierResult === true && this.props.resultAttained === false){
            renderElement = (
                <div>
                    <textarea placeholder="Enter your sentence here" className = "input-textarea" value={this.state.data} onChange={this.setData}>
                        Write sentence to be analysed
                    </textarea>
                    <div >
                        <button style={{margin: '30px auto'}} className = "btn btn-primary btn-lg" onClick={this.classifyData}>
                            Classify
                        </button>
                    </div>
                </div>
            )
        }

        else if(this.props.resultAttained ===  false && this.state.isTrained === false){
            renderElement = (
                <p className="primary-text">Please train first</p>
            )
        }

        else if(this.state.startTraining === true){
            renderElement = (
                <p>Training</p>
            )
        }

            return(
                <div>
                    {renderElement}
                </div>
            )
    }
}

ClassifiedData.defaultProps = {
    triggerClassifierResult: false,
}

export default ClassifiedData;