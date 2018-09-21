import React, { Component } from 'react';
import ReactDropzone from 'react-dropzone';
import './style.css';

class DropZone extends Component{
    constructor(props){
        super(props)
        this.state = {
            
        }
    }

    onDrop = (files) => {
        console.log("File uploaded")
        this.props.uploadingCSV(files);
    }

    render(){
        return(
            <div className="secondary-container">
                <div className="primary-text">Drag and Drop your CSV file here,</div>
                <div className="primary-text">or click to upload</div>
                <div style={{margin: '10px auto', width: '203px', color: 'grey'}}>
                    <ReactDropzone onDrop={this.onDrop}>
                        <div style={{margin: '80px auto', width: '10px'}}>+</div>
                    </ReactDropzone>
                </div>
            </div>
        )
    }
}

export default DropZone;
