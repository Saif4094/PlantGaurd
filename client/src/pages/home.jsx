import React, { useState } from 'react';
import axios from 'axios';
import { UserData } from '../context/imagecontext';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const {setPythonResult} = UserData();
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedImage) {
      alert('Please select a file to analyze!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await axios.post('http://localhost:5000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('The reponse is',(response.data));
      setPythonResult(response.data)
      // window.location.href = `/result?id=${response.data.product_id}`;
      navigate('/result');
    } catch (error) {
      console.error('There was an error analyzing the image!', error);
      alert('Please enter a proper image.');
    }
  };

  return (
    <div>
      <div className="container"><img src="bgimg.jpg" id="right" alt="background" /></div>
      <div className="heading">Plant Disease Detector</div>
      <div className="text">
        <p><b><span>Upload a picture of a Plant and get immediate results!</span></b></p>
      </div>
      <div className="inner">
        <form id="analysis-form" onSubmit={handleSubmit}>
          <div className="imgbox">
            <img src={preview || "bgimg.jpg"} className="img" id="selected_image" alt="Selected" />
            <div className="middle">
              <div className="add"><span className="siz">SELECT IMAGE</span></div>
              <input name="Select File" id="imagefile" width="100%" type="file" onChange={handleImageChange} />
            </div>
          </div>
          <button id="analyze-button" className="analyze-button">
            <span>Predict</span>
          </button>
        </form>
      </div>
      {/* {pythonresults && (
        <div className="results">
          <h2>Analysis Results:</h2>
          <p>Product ID: {pythonresults.product_id}</p>
          <p>Disease Name: {pythonresults.disease_name}</p>
          <p>Supplement Name: {pythonresults.supplement_name}</p>
          <img src={pythonresults.supplement_image} alt="Supplement" />
          <p>
            Buy Link: <a href={pythonresults.buy_link} target="_blank" rel="noopener noreferrer">{pythonresults.buy_link}</a>
          </p>
        </div>
      )} */}
    </div>
  );
};

export default HomePage;
