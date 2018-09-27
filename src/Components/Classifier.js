import React, { Component } from 'react';
import TrainClassifier from './TrainClassifier';
import TestClassifier from './TestClassifier';
import './Classifier.css'
import './style.css'

import LabelBinarizer from './helperClasses/LabelBinarizer';

import * as tf from '@tensorflow/tfjs';
const model = tf.sequential();
export const binarizer = new LabelBinarizer();

class Classifier extends Component{
    constructor(props){
        super(props)
        this.state = {
            addOnTopLoader: false,
            triggerClassifierResult: false,
            resultClass: 'Class',
            resultAccuracy: 0,
            resultAttained: false,
        }
        this.baseState = this.state;
    }

    resetAllStates = () => {
        this.setState(this.baseState);
    }

    learner = (input, output) => {
        this.setState({addOnTopLoader: true})
        model.add(tf.layers.dense({ units: 512, inputShape: [2500], activation: 'relu' }));
        model.add(tf.layers.dense({ units: 256, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 6, activation: 'softmax' }));

        model.compile({ optimizer: 'RMSProp', loss: 'categoricalCrossentropy' });

        const xs = tf.tensor2d(input, [input.length, 2500]);
        const ys = tf.tensor2d(output, [output.length, 6]);

        console.log(input);
        console.log(output);

        model.fit(xs, ys,{
            batchSize: 128,
            epochs: 2,
            verbose: 1,
            callbacks: {
                onTrainBegin: (log) => {
                console.log('Training started...');
                },
                onEpochEnd: (epoch, log) => {
                console.log("Epoch " + epoch + ": loss = " + log.loss);
                },
                onTrainEnd: (log) => {
                this.setState({triggerClassifierResult: true, addOnTopLoader: false})
                console.log('...Training completed');
                }
            }
        });
    };

    getClassifyResult = (xs) => {
        return new Promise((resolve,reject)=>{
            var y = model.predict(tf.tensor2d(xs, [1, 2500]));
            console.log('1',y);
            var res = y.dataSync();
            console.log('2',res);
            var confidence = Math.max(...res);
            console.log('confidance is chanign', confidence);
            var idx = res.indexOf(confidence);
            var top_predicted_class = binarizer.classes_[idx];
            const result={
                resultClass: top_predicted_class, 
                resultAccuracy: confidence,
            }
            console.log('here is a log result', result);
            resolve(result)
            this.setState({resultAttained: true})
        });
    }

    triggerResult = () => {
        this.setState({triggerClassifierResult: true});
    }

    render() {
        let renderTrainClassifier = null;
        if(this.state.addOnTopLoader){
            renderTrainClassifier = (
                <div className="container">
                <div className="lds-dual-ring"></div>
                </div>
            )
        }
        else{
            renderTrainClassifier = (
                <TrainClassifier resetAllStates = {this.resetAllStates} learner = {this.learner} className={`trainClassfier ${this.state.addOnTopLoader ? 'trainClassfier-opacity' : ''}`} />
            )
        }
        return(
            <div className = 'AppContainer'>

                <div className="trainClassifier container">
                    <div className="primary-header">
                        TRAIN YOUR CLASSIFIER
                    </div>
                    {renderTrainClassifier}
                </div>
                <div className="testclassfier-container">
                    <TestClassifier
                        resultAttained = {this.state.resultAttained}
                        getClassifyResult={this.getClassifyResult}
                        triggerClassifierResult = {this.state.triggerClassifierResult}
                        resultClass={this.state.resultClass}
                        resultAccuracy={this.state.resultAccuracy}
                        className="testClassifier"
                    />
                </div>
            </div>
        );
    }
}

export default Classifier;