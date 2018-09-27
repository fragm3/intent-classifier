import React, { Component } from 'react';
import DropZone from './DropZone'
import './style.css';

import Tokenizer from './helperClasses/Tokenizer';
import CSVParser from './helperClasses/CSVParser';

import {binarizer} from './Classifier'

export const tokenizer = new Tokenizer(2500);

class TrainClassifier extends Component{
    constructor(props){
        super(props)
        this.state = {
            isFileUploaded: false,
            isFileTrained: false,
            startTraining: false,
            isTraining: false,
            isCSVParsed: false,
            csvData: [{class: '', samples: ''}],
            X_train: '',
            Y_train: '',
        }
        this.baseState = this.state 
    }

    uploadingCSV = (files) => {
        var file = files[0];
        if (file) {
        var reader = new FileReader();
        var tokenizer = new Tokenizer(2500);
        let data;
        
        reader.onload = ((reader) => {
            return (e) => {
                var parser = new CSVParser();
                data = parser.parse(reader.result, { delimiter: "^", header: true })

                var len = data.length;
                var X_train = [];
                var Y_train = [];
                for (let i = 0; i < len; i++) {
                    X_train.push(data[i][1]);
                    Y_train.push(data[i][0]);
                }

                this.setState({X_train, Y_train});

                var dataArray = [];

                for(var j = 0; j < len; j++){
                    var obj = {class: data[j][0], samples: data[j][1]};
                    dataArray.push(obj);
                }
                var segAns = [];
                dataArray.forEach((x) => {
                    let obj = segAns.find(o => o.class === x.class);
                    if(obj) obj.samples.push(x.samples)
                    else{
                        obj = {};
                        obj.class = x.class;
                        obj.samples = [];
                        obj.samples.push(x.samples);
                        segAns.push(obj);
                    }
                })
                this.setState({csvData: segAns, isCSVParsed: true});
            };
        })(reader);

        reader.readAsText(file);
        }
        this.setState({isFileUploaded: true})
    }

    startTrain = () => {
        tokenizer.fit_on_texts(this.state.X_train);
        const input = tokenizer.texts_to_matrix(this.state.X_train, 'tfidf');
        const output = binarizer.fit_transform(this.state.Y_train);
        this.props.learner(input, output);

        this.setState({isFileTrained: true, isTraining: false});
    }

    startTrainAgain = () => {
        this.setState(this.baseState)
        this.props.resetAllStates();
    }

    render() {
        let tabs= [];
        let sampleData;
        if(this.state.csvData){
            if(this.state.isCSVParsed){
            tabs = this.state.csvData.map((data, i) => {
                return (
                <div key = {i} className="content-classified-container">
                    <p className="class-heading text-centre">{`${data.class}`}</p>
                    <div>
                        <div className="classified-box-long">
                            {sampleData = data.samples.map((sample, idx) => {
                                return(
                                    <div>
                                        <div className="result-sample" key ={idx}>{sample}</div>
                                        <hr style={{borderWidth: '0.5px'}}/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                )
            })}
            else if(this.state.isCSVParsed === false){
                tabs = (
                    <div className="loader-container">
                    <div className="lds-dual-ring"></div>
                    </div>
                )
        }
    }

        let renderElement = null;

        if(this.state.isFileUploaded === false){
            renderElement = <DropZone uploadingCSV = {this.uploadingCSV}/>
        }

        else if(this.state.isFileUploaded === true && this.state.isTraining === false){
            renderElement = (
                    <div>
                        <div className="classified-data-container-parent">
                            <div className="classified-data-container">
                            {tabs}
                            </div>
                        </div>
                        <button className = "btn btn-primary" onClick={this.startTrain}>Start Training</button>
                        <button style = {{marginLeft: '10px'}} className = "btn btn-secondary" onClick={this.startTrainAgain}>Start Over</button>
                    </div>
                )
            }

        else if(this.state.isTraining === true && this.state.isFileTrained === false){
            renderElement = (
            <div className="secondary-container">
                <div className="primary-text">
                    Training...
                </div>
            </div>
            )
        }

        else{
            renderElement = (
            <div className = "secondary-container">
                <div className="primary-text">
                    Training complete
                </div>
                <button style={{marginTop: '20px'}}className = "button-secondary" onClick={this.startTrainAgain}>Train another model</button>
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

export default TrainClassifier;