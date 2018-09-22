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
                <div style={{margin: '10px auto', width: '70%', color: 'grey'}}>
                    <ReactDropzone className="dropzone" onDrop={this.onDrop}>
                        <div style={{color: 'grey', margin: '80px auto', width: '150px'}}>
                        <div>Drop your CSV file</div>
                        <div style={{margin: '20px 0', fontSize: '10px'}}>OR</div>
                        <button className='btn btn-outline-primary'>
                            Browse File
                        </button>
                        </div>
                    </ReactDropzone>
                </div>
            </div>
        )
    }
}

export default DropZone;
