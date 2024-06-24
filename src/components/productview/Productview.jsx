import React, { useState, useEffect } from 'react';
import "./productview.css";
import axios from "axios";
import ReactQuill from 'react-quill';
import { ImageDrop } from 'quill-image-drop-module';
import 'react-quill/dist/quill.snow.css'; // import styles
import htmlToMd from 'html-to-md';
import ReactMarkdown from 'react-markdown';
import { renderToString } from 'react-dom/server';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/material.css';
import CustomTooltip from '../../tooltips/CustomTooltip';
import tooltips from '../../tooltips/tooltips';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import {encodebody, getDecodedBody} from "../../utils/utils.js";

function Productview({ clientNr, explorerId, productName, authorization, updateTreeView }) {
  const [product, setProduct] = useState(null);

  const [isRichTextMode, setIsRichTextMode] = useState(true);

  const [markdownContent, setMarkdownContent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState("Private");

  const statusOptions = ["Private","Public"];

  const toggleDisplayMode = () => {
    setIsRichTextMode((prevMode) => !prevMode);
  };

  const handleDescriptionChange = (value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      description: value,
    }));
    const markdownContent = htmlToMd(value);
    setMarkdownContent(markdownContent);
  };

  const handleSequenceChange = (event) => {
    const inputValue = event.target.value;
  
    // Check if the input is a valid number
    if (/^\d+$/.test(inputValue) || inputValue === '') {
      // If it's a valid number or an empty string, update the state
      setProduct((prevProduct) => ({
        ...prevProduct,
        sequence: inputValue,
      }));
    }
    // If it's not a valid number, you can choose to do nothing or provide feedback to the user
    // For example, show an error message or prevent further action
  };

  const handleTextareaChange = (e) => {
    // Assuming e.target.value contains Markdown content
    const markdownContent = e.target.value;
    const htmlContent = <ReactMarkdown>{markdownContent}</ReactMarkdown>;
    const htmlString = renderToString(htmlContent);
    
    console.log("HTML VALUE");
    console.log(htmlContent);
    setProduct((prevProduct) => ({
      ...prevProduct,
      description: htmlString,
    }));
    setMarkdownContent(markdownContent);
  };


  const handleUpdate = async () => {
    const apiUrl = process.env.REACT_APP_CENTRAL_BACK + '/product/update';

    // Define the request body
    const requestBody = {
      clientNr: clientNr,
      explorerId: explorerId,  
      productName:product.productName,
      sequence: product.sequence,
      description: product.description,
      status: selectedStatus
    };

      const myResponse = await axios.post(apiUrl, encodebody(requestBody));
      alert("Product was succesfully updated.");

  };

  const handleDelete = async () => {
    const apiUrl = process.env.REACT_APP_CENTRAL_BACK + '/product/delete';

    // Define the request body
    const requestBody = {
      clientNr: clientNr,
      explorerId: explorerId, 
      productName:product.productName,
    };

      const myResponse = await axios.post(apiUrl, encodebody(requestBody));
      alert("Product was succesfully removed.");
      updateTreeView();

  };

  useEffect(() => {
    const fetchProduct = async () => {
      const apiUrl = `${process.env.REACT_APP_CENTRAL_BACK}/product/query`;

      // Define the request body
      const requestBody = {
        clientNr,
        explorerId,
        productName,
      };

      console.log("PRODUCT REQUEST BODY", requestBody)

      try {
        // Make a POST request to fetch the product
        const response = await axios.post(apiUrl, encodebody(requestBody), {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = getDecodedBody(response.data);
        // Set the fetched product data to the state
        setProduct(data);
        setSelectedStatus(data.status);
        const markdownContent = htmlToMd(data.description);
        setMarkdownContent(markdownContent);
      } catch (error) {
        console.log('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [clientNr, explorerId, productName]); // Dependency array ensures the effect runs when these variables change


  return (
    <div className="Productview">
      <div >
        
        {product ? (
          <div >
        <div className = 'left-top-buttons-productview' >
        <button className='editorButton' onClick={toggleDisplayMode}>
          {isRichTextMode ? 'Use Markdown Editor' : 'Use Rich Text Editor'}
        </button>
      {(authorization.designer || authorization.owner) && (
                <button className = "actionbutton" onClick={handleUpdate}>Update</button>        
            )}
      {(authorization.designer || authorization.owner) && (
                <button className = "actionbutton" onClick={handleDelete}>Remove</button>
            )}
       <a href="https://wiki.gwocu.com/en/GWOCU-Studio/products-detail-panel" target="_blank" rel="noopener noreferrer">
                        <HelpCenterIcon />
            </a>  
      </div>
            <div className = "input-container">
              <label className = "input-label" htmlFor="productName">Product Name:</label>
              <input
                type="text"
                id="productName"
                value={product.productName}
                className="ProductViewNameinput"
                disabled
              />
            </div>
            <div className = "input-container">
            <label className = "input-label" htmlFor="status">Status:</label>
              <select
                id="status"
                value={selectedStatus}
                className="ProductViewStatusinput"
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={!authorization.designer && !authorization.owner }
              >
                {statusOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className = "input-container">
              <label className = "input-label" htmlFor="sequence">Sequence:</label>
              <input
                type="text"
                id="sequence"
                value={product.sequence}
                className="ProductViewSequenceinput"
                onChange={handleSequenceChange}
                disabled={!authorization.designer && !authorization.owner }
          
              />
            </div>
            <div>
              <label htmlFor="productDescription">Description:</label>
              <br />
              {isRichTextMode ? (
                 <div style={{ overflowY: "auto", marginTop: "10px" , marginBottom: "14px", border: "1px solid white" }}>
                <ReactQuill
                  value={product.description}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2,3, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link'],
                      ['clean'],
                    ],
                  }}
                  theme = "snow"
                  className="Productviewinput"
                  onChange={handleDescriptionChange}
                  disabled={!authorization.designer && !authorization.owner }
                  readOnly =  {!authorization.designer && !authorization.owner }   
                  style={{ minHeight: '550px' }}       
                />
                </div>
              ) : (
                <textarea
              value={markdownContent}
              className="Markdowninput"
              disabled = {!authorization.designer && !authorization.owner }
              onChange={handleTextareaChange}
            /> 
              ) }
            </div>
          </div>
        ) : (
          <p>Loading product information...</p>
        )}
      </div>
      
    </div>
  );
}

export default Productview;
