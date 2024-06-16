import React, { useState, useEffect } from 'react';
import "./productcomplianceview.css";
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


function Productcomplianceview({ clientNr, explorerId, productName, authorization, updateTreeView }) {
  const [product, setProduct] = useState(null);

  const [isRichTextMode, setIsRichTextMode] = useState(true);

  const [markdownContent, setMarkdownContent] = useState('');

  const toggleDisplayMode = () => {
    setIsRichTextMode((prevMode) => !prevMode);
  };

  const handleComplianceDescriptionChange = (value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      complianceDescription: value,
    }));
    const markdownContent = htmlToMd(value);
    setMarkdownContent(markdownContent);
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
      complianceDescription: htmlString,
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
      complianceDescription: product.complianceDescription
    };

      const myResponse = await axios.post(apiUrl, encodebody(requestBody));
      alert("Product was succesfully updated.");

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
        const markdownContent = htmlToMd(data.complianceDescription);
        setMarkdownContent(markdownContent);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [clientNr, explorerId, productName]); // Dependency array ensures the effect runs when these variables change


  return (
    <div className="Productcomplianceview">
      <div>
        {product ? (
          <div>
         
        <div className = "left-top-buttons-productview">
        <button className='editorButton' onClick={toggleDisplayMode}>
          {isRichTextMode ? 'Use Markdown Editor' : 'Use Rich Text Editor'}
        </button>
      {(authorization.designer || authorization.owner) && (
                <button className = "actionbutton" onClick={handleUpdate}>Update</button>
            )}
      <Tippy content={<CustomTooltip content={tooltips.productComplianceDescription.content} isHtml={tooltips.productComplianceDescription.isHtml} />} placement="right" theme = "terminal" trigger ='click' interactive = "true" >      
      <HelpCenterIcon/>
      </Tippy>
      </div>
            <div>
              <label htmlFor="productName">Product Name</label>
              <br />
              <input
                type="text"
                id="productName"
                value={product.productName}
                className="ProductViewinput"
                disabled
              />
            </div>
            <div>
              <label htmlFor="productDescription">Compliance Description</label>
              <br />
              {isRichTextMode ? (
                 <div style={{ overflowY: "auto", marginTop: "10px" , marginBottom: "14px", border: "1px solid white" }}>
                <ReactQuill
                  value={product.complianceDescription}
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
                  className="ProductComplienceviewinput"
                  onChange={handleComplianceDescriptionChange}
                  disabled = {!authorization.designer && !authorization.owner} 
                  readOnly =  {!authorization.designer && !authorization.owner}
                  style={{ minHeight: '550px' }}     
                />
                </div>
              ) : (
                <textarea
              value={markdownContent}
              className="Markdowninput"
              disabled = {!authorization.designer && !authorization.owner}
              onChange={handleTextareaChange}
            />
              )}
            </div>
          </div>
        ) : (
          <p>Loading product information...</p>
        )}
      </div>

      
    </div>
  );
}

export default Productcomplianceview;
