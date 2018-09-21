import React, { Component } from 'react';
import ClassifiedData from './ClassifiedData'

class TestClassifier extends Component{
    constructor(props){
        super(props)
        this.state = {
            
        }
    }
    render() {
        return(
            <div className="container">
                <div className="primary-header">
                    TEST YOUR CLASSIFIER
                </div>
                <div className="secondary-container">
                    <ClassifiedData
                        triggerClassifierResult = {this.props.triggerClassifierResult}
                        getClassifyResult={this.props.getClassifyResult}
                        resultClass={this.props.resultClass}
                        resultAccuracy={this.props.resultAccuracy}
                    />
                </div>
            </div>
        )
    }
}

export default TestClassifier;