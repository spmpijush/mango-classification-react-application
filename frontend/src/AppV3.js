/* eslint-disable no-template-curly-in-string */



import LinePlot from './LinePlot'
import "./App.css";
import axios from 'axios';
// import mysql from 'mysql';
import React, { Component } from 'react'
// import InsertPriceData from './InsertPriceData';
import MangoDataAdd from './MangoDataAdd';


export default class App extends Component {


    constructor() {
        super();
        this.state = {
            selectedFile: "",
            imagePreviewUrl: null,
            mangoName: "",
            confidence: null,


            imageSrc: null,
            videoimg: true,
            isOpen: false,
            stream: null,
            error: null,
            camerabtntext: "Open Camera",
            chooseFileoc: true,

            priceData: [],
            mango_list: [],
            disableBtn: false,
            resultSection: false,
            tableData: false,

            insertDataShow: false,
            insertBtnTxt: "Add Price Data",
            addPriceDataText: "",
        }

        this.videoRef = React.createRef();
        this.canvasRef = React.createRef();


    }



    cameraOpenClose = (e) => {
        e.preventDefault();
        if (this.state.isOpen === true) {
            this.setState({ isOpen: false, chooseFileoc: true, imageSrc: null, disableBtn: false, imagePreviewUrl: null, resultSection: false, tableData: false, selectedFile: "", camerabtntext: "Open Camera" });
            const stream = this.videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
        } else {
            this.setState({ chooseFileoc: false, isOpen: true, imageSrc: null, disableBtn: false, imagePreviewUrl: null, resultSection: false, tableData: false, selectedFile: "", camerabtntext: "Close Camera" });
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                this.videoRef.current.srcObject = stream;
            });
        }
    };


    handleTakePicture = (e) => {
        e.preventDefault();
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        const video = this.videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const image = canvas.toDataURL('image/jpeg');
        this.setState({ imageSrc: image, videoimg: true, disableBtn: true, });

    }
    handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', this.dataURItoBlob(this.state.imageSrc));
        var url = "http://localhost:8000/predict";
        let res = await axios.post(url, formData)
        // console.log(res.data.confidence);
        this.setState({
            // mangoName: res.data.class,
            // confidence: res.data.confidence,
            resultSection: true,
        });
        this.confidenceAndMangoName(res.data.class, res.data.confidence);
    }

    dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }





    myHandeler = (e) => {
        const imgData = e.target.files[0]
        if (!imgData) {

            this.setState({ imagePreviewUrl: null, disableBtn: false, })
        } else {

            this.setState({ selectedFile: imgData })
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    imagePreviewUrl: reader.result,
                    videoimg: false,
                    disableBtn: true,
                    tableData: false,
                });
            };
            reader.readAsDataURL(imgData);
        }
    }


    submitHandeler = async (e) => {
        e.preventDefault();
        var url = "http://localhost:8000/predict";
        const formData = new FormData();
        formData.append("file", this.state.selectedFile);
        // formData.append("file", this.dataURItoBlobb(this.state.selectedFile));
        let res = await axios.post(url, formData)
        // console.log(res.data.confidence);
        this.setState({
            // mangoName: res.data.class,
            // confidence: res.data.confidence,
            resultSection: true,
        });
        this.confidenceAndMangoName(res.data.class, res.data.confidence);
    }


    confidenceAndMangoName = (mName, conf) => {
        console.log(mName);
        console.log(conf);
        if (conf < 0.80) {
            this.setState({ mangoName: "Unknown", confidence: null })
        } else {
            this.setState({ mangoName: mName, confidence: conf })
        }

    }



    componentDidMount = () => {
        // console.log("component");
        fetch(`http://localhost:8000/mango_list`).then((result) => {
            result.json().then((response) => {
                this.setState({ mango_list: response.data });
                // console.log(this.state.mango_list);
            }).catch(error => console.error(error));
        })
    };

    fetchSelectedData = (e) => {
        e.preventDefault();
        this.setState({ tableData: true })
        const mangoName = this.state.mangoName;
        fetch(`http://localhost:8000/priceData?mango_name=${mangoName}`).then((result) => {
            result.json().then((response) => {
                this.setState({ priceData: response.data });
            }).catch(error => console.error(error));
        })
    }

    insertData = (e) => {
        e.preventDefault();
        if (this.state.insertDataShow === true) {
            this.setState({ insertDataShow: false, insertBtnTxt: "Add Price Data", addPriceDataText: "" })
        } else {
            this.setState({ insertDataShow: true, insertBtnTxt: "Close ", addPriceDataText: "-> Add Price Data" })
        }



    }


    render() {
        const { imagePreviewUrl, isOpen, mango_list } = this.state;
        let htmldata = null
        if (((this.state.confidence) % 1).toFixed(2).substring(2) === "00") {
            htmldata = 100
        } else {
            htmldata = ((this.state.confidence) % 1).toFixed(2).substring(2)
        }

        let callButton = null;
        if (this.state.videoimg) {
            callButton = this.handleUpload;

        } else {
            callButton = this.submitHandeler;

        }



        const { priceData } = this.state;

        const tableRows = priceData.map((row, index) => (
            <tr key={index}>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]} / QL</td>
            </tr>
        ));
        const mango_names = mango_list.map((row, index) => (
            <div key={index} className="mango_name_list">
                <h5 className="m_list_num">{index + 1} .</h5>
                <h5 className="m_name">{row[0]}</h5>
            </div>
        ));

        const btnStyle = {
            opacity: 0.6,
            cursor: this.state.disableBtn ? "pointer" : 'not-allowed',
            margin: '10px 5px',
            padding: '5px 15px',
            borderRadius: '10px',
            visibility: this.state.disableBtn ? 'visible' : 'hidden',
        };
        const AddButtonStyle = {
            border: 'none',
            padding: '6px 10px',
            backgroundColor: this.state.insertDataShow ? 'rgb(245, 58, 58)' : 'rgb(67, 242, 70)',
        };




        return (
            <div>
                <div className="container-fluid pt-3 image_bg_box">
                    <div className="container apply_glassmorphic">
                        <div className="project_header ">
                            <h3 className="text-center">Mango Classification {this.state.addPriceDataText}</h3>
                            <label className="add_button_edit">
                                <button style={AddButtonStyle} id="add_data" onClick={this.insertData} >{this.state.insertBtnTxt}  </button>
                            </label>
                        </div>
                        <div className="row">
                            <div className="col-lg-2 col-md-2 col-sm-12">
                                <div className=" content_main_box">
                                    <h4 className="text-center mango_name_box">Mango Name</h4>

                                    <div className="">
                                        {mango_names}
                                    </div>

                                </div>
                            </div>
                            {/* <InsertPriceData /> */}
                            <div className="col-lg-10 col-md-10 col-sm-12">
                                {
                                    this.state.insertDataShow ?


                                        <MangoDataAdd />
                                        :

                                        <div className=" content_main_box p-2">
                                            <div className="row">
                                                <div className="col-lg-4 col-md-4 col-sm-12">
                                                    <div className="section_1_camera_and_image inner_border">
                                                        <div className="drag_and_drop_and_camera">

                                                            {
                                                                this.state.chooseFileoc ?
                                                                    <form onSubmit={this.submitHandeler} className="form">

                                                                        <label className="custom-file-upload">
                                                                            <input type="file" id="formFile" onChange={this.myHandeler} />
                                                                            Choose Image <i className="far fa-image" />
                                                                        </label>
                                                                    </form>
                                                                    :
                                                                    <div className="open_camera_hendal">

                                                                        {
                                                                            isOpen ?
                                                                                <div>
                                                                                    <video ref={this.videoRef} autoPlay ></video>
                                                                                    <canvas ref={this.canvasRef} style={{ display: 'none' }} ></canvas>
                                                                                    <div className="take_picture_box">
                                                                                        <button onClick={this.handleTakePicture}>Take Picture</button>
                                                                                    </div>
                                                                                </div>
                                                                                : null
                                                                        }
                                                                    </div>
                                                            }

                                                        </div>

                                                        <div className="openclosecamerabtn_box">
                                                            <button onClick={this.cameraOpenClose} className="openclosecamerabtn">{this.state.camerabtntext}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-4 col-sm-12">
                                                    <div className="section_2_display_image inner_border">
                                                        <div className="image_box ">
                                                            {
                                                                this.state.chooseFileoc ?
                                                                    <div>
                                                                        {imagePreviewUrl && <img className="image_box" src={imagePreviewUrl} alt="Preview" />}
                                                                    </div>
                                                                    :
                                                                    <div>
                                                                        {
                                                                            this.state.imageSrc &&
                                                                            <img className="image_box" src={this.state.imageSrc} alt="Captured" />
                                                                        }
                                                                    </div>
                                                            }
                                                        </div>


                                                        <div className="text-center button_for_submit">
                                                            <input onClick={callButton} type="submit" style={btnStyle} value="Now Predict"></input>
                                                        </div>


                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-4 col-sm-12">
                                                    <div className="section_3 inner_border">
                                                        <div className="result_box">
                                                            <h3 className="text-center result_title">Predicted Result</h3>
                                                            {
                                                                this.state.resultSection ?

                                                                    <div className="result_show_box">
                                                                        <div className="mango_name">
                                                                            <h4>Mango Name :</h4>
                                                                            <h4>{this.state.mangoName}</h4>
                                                                        </div>
                                                                        <div className="confidence">
                                                                            <h4>Confident :</h4>
                                                                            {
                                                                                this.state.confidence ?
                                                                                    <h4>{htmldata} %</h4>
                                                                                    :
                                                                                    <h4>00 % </h4>
                                                                            }

                                                                        </div>
                                                                    </div>
                                                                    : null
                                                            }

                                                        </div>
                                                        {
                                                            this.state.resultSection ?

                                                                <div className="text-center ">
                                                                    <button onClick={this.fetchSelectedData} style={btnStyle}>Show Current Price</button>
                                                                </div>
                                                                : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="col-lg-6 col-md-6 col-12">
                                                    <div className="">
                                                        <table className="table table-striped table-hover table-bordered table-sm table-responsive-sm">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Mango Name</th>
                                                                    <th scope="col">District</th>
                                                                    <th scope="col">Date</th>
                                                                    <th scope="col">Price</th>
                                                                </tr>
                                                            </thead>
                                                            {
                                                                this.state.tableData ?

                                                                    <tbody>
                                                                        {tableRows}
                                                                    </tbody>
                                                                    : null
                                                            }
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-12">
                                                    <div className="inner_border">

                                                        <LinePlot mangoName={this.state.mangoName} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
