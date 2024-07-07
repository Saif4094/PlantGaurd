import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserData } from '../context/imagecontext';

const ResultPage = () => {
  // const [PythonResult, setAppData] = useState({});
  // const location = useLocation();
  // const query = new URLSearchParams(location.search);
  // const id = query.get('id');
  const {PythonResult} = UserData();
  return (
    <>
    <div>
      <div className="container"><img src="bgimg.jpg" id="right" alt="background" /></div>
      <div className="heading">PREDICTING THE RESULTS...</div>
      <div className="text">
        <p><b>The disease detected in the plant is: </b></p>
        <h1>Name: {PythonResult.disease_name}</h1>
        <h3>Pesticide for Prevention: {PythonResult.supplement_name}</h3>
        <a href={PythonResult.buy_link}>
          <img src={PythonResult.supplement_image} alt="product" style={{ display: 'block' }} width="125" height="175" align="center" />
        </a>
      </div>
      <div className="inner">
        <div id="result"></div>
      </div>
    </div>
    
     {/* {PythonResult && (
        <div className="results">
          <h2>Analysis Results:</h2>
          <p>Product ID: {PythonResult.product_id}</p>
          <p>Disease Name: {PythonResult.disease_name}</p>
          <p>Supplement Name: {PythonResult.supplement_name}</p>
          <img src={PythonResult.supplement_image} alt="Supplement" />
          <p>
            Buy Link: <a href={PythonResult.buy_link} target="_blank" rel="noopener noreferrer">{PythonResult.buy_link}</a>
          </p>
        </div>
      )} */}
    </>
  );
};

export default ResultPage;
