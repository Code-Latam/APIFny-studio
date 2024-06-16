import React, { useState, useEffect } from "react";
import axios from "axios";
import "./modalworkflow.css";
import {encodebody, getDecodedBody} from "../../utils/utils.js";

function Modalworkflow({ clientNr, explorerId, onClose }) {

  console.log("In modal workflow");
  console.log(explorerId);


  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWorkflowName, setSelectedWorkflowName] = useState("No Name Yet");
  const [selectedWorkflowDescription, setSelectedWorkflowDescription] = useState("No Description Yet");
  const [selectedSequence, setSelectedSequence] = useState("1");

  useEffect(() => {
    const fetchData = async () => {
      // first query products for products listbox


      const myProductsPayload = {
        clientNr: clientNr,
        explorerId: explorerId,
      }
      try {
        const productresponse = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/product/queryall", encodebody(myProductsPayload));
        const productresponseData = getDecodedBody(productresponse.data);
        setProducts(productresponseData);
        
        if (productresponseData.length > 0) {
          setSelectedProduct(productresponseData[0].productName);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  const handleNameChange = (event) => {
    setSelectedWorkflowName(event.target.value);
  };
  
  const handleDescriptionChange = (event) => {
    setSelectedWorkflowDescription(event.target.value)
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
    if (await handleCreateProduct(selectedProduct, selectedWorkflowName,selectedWorkflowDescription, selectedSequence))
    {
      onClose(); 
    }  
  };

  async function handleCreateProduct(productName, workflowName, workflowDescription, sequence) {
    try {
      const mypayload = {
        clientNr: clientNr,
        explorerId: explorerId,
        productName: productName,
        name: workflowName,
        sequence: sequence,
        description: workflowDescription,
        status: "Private",
      };
  
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/workflow/register", encodebody(mypayload));
      const responseData = getDecodedBody(response.data)
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
    <div className="AddWorkflowModalDialog">
      <div>
        <div className="top">
          <div className="left">Add new Workflow</div>
          <div className="close" onClick={onClose}>
            &times;
          </div>
        </div>

        <div className="workflow-switch-container">
          <label htmlFor="products">Product</label>
          <select
            id="products"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className = "workflow-switch-container"
          >
            {products.map((product) => (
              <option key={product.productName} value={product.productName}>
                {product.productName}
              </option>
            ))}
          </select>

          <div>
              <label htmlFor="workflowName">Workflow Name</label>
              <br />
              <input
                type="text"
                id="workflowName"
                value={selectedWorkflowName}
                className="WorkflowModalinputname"
                onChange={handleNameChange}
              />
            </div>
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
              <label htmlFor="workflowDescription">Description</label>
              <br />
              <textarea
                id="workflowDescription"
                value={selectedWorkflowDescription}
                className="WorkflowModalinputname"
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


export default Modalworkflow;
