import React, { Component } from 'react';
import './style.css';

import Tokenizer from './helperClasses/Tokenizer';

const tokenizer = new Tokenizer(2500);

class ClassifiedData extends Component{
    constructor(props){
        super(props)
        this.state = {
            isTrained : false,
            startTraining: false,
            data: '',
            dataEdited: '',
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
        var text = this.state.data;
        debugger;
        var xs = tokenizer.texts_to_matrix([text], 'tfidf');
        debugger;
        this.props.getClassifyResult(xs);
        //this.setState({data : ''})
    }

    render() {
        console.log(this.props.resultClass, "Result class")
        let renderElement = null;
        if(this.props.triggerClassifierResult === true && this.props.resultAttained === true){
            //this.setState({isTrained: true});
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
                            <div className="btn result-class" style= {{margin: '5px'}}>{this.props.resultClass}</div>
                            <div className="btn result-confidence" style= {{margin: '5px'}}>{this.props.resultAccuracy}</div>
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