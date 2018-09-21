import React, { Component } from 'react';
import './style.css';
import * as tf from '@tensorflow/tfjs';

import Tokenizer from './helperClasses/Tokenizer';
import LabelBinarizer from './helperClasses/LabelBinarizer';

const tokenizer = new Tokenizer(2500);
const binarizer = new LabelBinarizer();

class ClassifiedData extends Component{
    constructor(props){
        super(props)
        this.state = {
            isTrained : false,
            startTraining: false,
            data: '',
            dataEdited: '',
            //resultClass: 'Batman',
            //resultAccuracy: '99%' 
            // resultAccuracy: this.props.resultClass,
            // resultClass: this.props.resultAccuracy
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
        this.setState({data : ''})
    }

    // getDerivedStateFromProps(nextProps, prevState){
    //     if(nextProps.resultAccuracy!==prevState.resultAccuracy){
    //         return { resultClass: nextProps.resultClass, resultAccuracy: nextProps.resultAccuracy};
    //    }
    //    else return null;
    //}

    render() {
        console.log(this.props.resultClass, "Result class")
        let renderElement = null;
        if(this.props.triggerClassifierResult === true){
            //this.setState({isTrained: true});
            renderElement = (
                <div>
                    <textarea className = "input-textarea" value={this.state.data} onChange={this.setData}>
                        Write sentence to be analysed
                    </textarea>
                    <div >
                        <button style={{margin: '30px auto'}} className = "button-primary" onClick={this.classifyData}>
                            Classify
                        </button>
                        <div style={{display: 'flex', justifyContent: 'spaceEvenly', alignContent: 'row'}}>
                            <div className="classified-box" style= {{margin: '5px'}}>{this.props.resultClass}</div>
                            <div className="classified-box" style= {{margin: '5px'}}>{this.props.resultAccuracy}</div>
                        </div>
                    </div>
                </div>
            )
        }
        else if(this.state.isTrained === false){
            renderElement = (
                <p className="primary-text">Please train first</p>
            )
        }

        else if(this.state.startTraining === true){
            renderElement = (
                <p>Training</p>
            )
        }

        else{
            renderElement = (
                <div>
                    <textarea className = "input-textarea" value={this.state.data} onChange={this.setData}>
                        Write sentence to be analysed
                    </textarea>
                    <div >
                        <button style={{margin: '30px auto'}} className = "button-primary" onClick={this.classifyData}>
                            Classify
                        </button>
                        <div style={{display: 'flex', justifyContent: 'spaceEvenly', alignContent: 'row'}}>
                            <div className="classified-box" style= {{margin: '5px'}}>{this.state.resultClass}</div>
                            <div className="classified-box" style= {{margin: '5px'}}>{this.state.resultAccuracy}</div>
                        </div>
                    </div>

                </div>
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