import React, { useState, useEffect } from "react";
import axios from "axios";
import "./modalproduct.css";
import {encodebody, getDecodedBody} from "../../utils/utils.js";

function Modalproduct({ clientNr, explorerId, onClose }) {

  const [products, setProducts] = useState([]);

  const [selectedSequence, setSelectedSequence] = useState("1");
  const [selectedProductName, setSelectedProductName] = useState("No Name Yet");
  const [selectedProductDescription, setSelectedProductDescription] = useState("No Description Yet");
  

  useEffect(() => {

  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  const handleNameChange = (event) => {
    setSelectedProductName(event.target.value);
  };
  
  const handleDescriptionChange = (event) => {
    setSelectedProductDescription(event.target.value)
    }

  const handleSequenceChange = (event) => {
      const inputValue = event.target.value;
    
      // Check if the input is a valid number
      if (/^\d+$/.test(inputValue) || inputValue === '') {
        // If it's a valid number or an empty string, update the state
        setSelectedSequence(inputValue);
      }
      // If it's not a valid number, you can choose to do nothing or provide feedback to the user
      // For example, show an error message or prevent further action
    };

  
  const handleSave = async () => {
    // Perform save logic with selectedSource and selectedTarget
    // You can use these values to update your backend or state, as needed
    if (await handleCreateProduct(selectedProductName,selectedProductDescription, selectedSequence))
    {
      onClose(); 
    }  
  };

  async function handleCreateProduct(productName, productDescription, sequence) {
    try {
      const mypayload = {
        clientNr: clientNr,
        explorerId: explorerId,
        productName: productName,
        sequence: sequence,
        description: productDescription,
        status: "Private",
      };
  
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/product/register", encodebody(mypayload));
      const responseData = getDecodedBody(response.data);
      // Check if the response indicates an error
      if (responseData && responseData.error) {
        // Display an alert with the error data
        alert(`Error: ${responseData.error}`);
        return false;
      }
  
      // setNodesAdded(nodesAdded + 1);
      return true;
    } catch (error) {
      // Handle unexpected errors (e.g., network issues)
      console.error("An unexpected error occurred:", error);
      alert("An unexpected error occurred. Please try again.");
      return false;
    }
  };
  

  

  return (
    <div className="ProductmodalDialog">
      <div>
        <div className="top">
          <div className="left">Add new Product</div>
          <div className="close" onClick={onClose}>
            &times;
          </div>
        </div>
        <br/>
          <div>
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                value={selectedProductName}
                className="ProductModalinputname"
                onChange={handleNameChange}
              />
              <div>
              <label htmlFor="sequence">sequence in product tree</label>
              <br />
              <input
                type="text"
                id="sequence"
                value={selectedSequence}
                className="WorkflowSequenceViewinput"
                onChange={handleSequenceChange}
          
              />
              </div>
            <div>
              <label htmlFor="productDescription">Description</label>
              <br />
              <textarea
                id="productDescription"
                value={selectedProductDescription}
                className="ProductModalinputname"
                onChange={handleDescriptionChange}
                rows= "10"
                style={{ maxHeight: "200px", overflowY: "auto", width: "350px" }}
              />
            </div>
        </div>

        <div className="modalDialog-buttons">
          <button className="modalclosebutton" onClick={onClose}>
            Close
          </button>
          <button className="modalsavebutton" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}


export default Modalproduct;
