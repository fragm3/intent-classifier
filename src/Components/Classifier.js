import React, { Component } from 'react';
import TrainClassifier from './TrainClassifier';
import TestClassifier from './TestClassifier';
import './Classifier.css'
import './style.css'

import LabelBinarizer from './helperClasses/LabelBinarizer';

import * as tf from '@tensorflow/tfjs';
const model = tf.sequential();
const binarizer = new LabelBinarizer();

class Classifier extends Component{
    constructor(props){
        super(props)
        this.state = {
            addOnTopLoader: false,
            triggerClassifierResult: false,
            resultClass: 'Class',
            resultAccuracy: 0,
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
                //this.setState({isTraining: true});
                },
                onEpochEnd: (epoch, log) => {
                //useless
                console.log("Epoch " + epoch + ": loss = " + log.loss);
                },
                onTrainEnd: (log) => {
                this.setState({triggerClassifierResult: true, addOnTopLoader: false})
                //this.setState({isFileTrained: true});
                console.log('...Training completed');
                }
            }
        });
    };

    getClassifyResult = (xs) => {
        var y = model.predict(tf.tensor2d(xs, [1, 2500]));
        var res = y.dataSync();
        var confidence = Math.max(...res);
        var idx = res.indexOf(confidence);
        console.log("Index", idx)
        var top_predicted_class = binarizer.classes_[idx];
        //debugger;
        this.setState({resultClass: top_predicted_class, resultAccuracy: confidence.toFixed(2)})
    }

    triggerResult = () => {
        this.setState({triggerClassifierResult: true});
        console.log('Triggered');
    }

    render() {
        console.log(this.state.addOnTopLoader)
        let renderTrainClassifier = null;
        if(this.state.addOnTopLoader){
            renderTrainClassifier = (
                <div style={{margin: '200px auto', position: 'absolute', width: '60%', height: '70%'}}>
                    <h1 style={{margin: '0 auto'}} className = "primary-text">Training</h1>
                </div>
            )
        }
        return(
            <div className = 'AppContainer'>
                <div>
                    {renderTrainClassifier}
                    <TrainClassifier resetAllStates = {this.resetAllStates} learner = {this.learner} className={`trainClassfier ${this.state.addOnTopLoader ? 'trainClassfier-opacity' : ''}`} />
                </div>
                <TestClassifier
                    getClassifyResult={this.getClassifyResult}
                    triggerClassifierResult = {this.state.triggerClassifierResult}
                    resultClass={this.state.resultClass}
                    resultAccuracy={this.state.resultAccuracy}
                    className="testClassifier" />
            </div>
        );
    }
}

export default Classifier;