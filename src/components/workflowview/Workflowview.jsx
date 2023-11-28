import React, { useState, useEffect } from 'react';
import "./workflowview.css";
import axios from "axios";

function Workflowview({ clientNr, explorerId, productName, name, designerMode, updateTreeView  }) {
  const [workflow, setWorkflow] = useState(null);

  useEffect(() => {
    // Define the API URL for fetching the product
    const apiUrl = process.env.REACT_APP_CENTRAL_BACK + '/workflow/query';

    // Define the request body
    const requestBody = {
      clientNr,
      explorerId,
      productName,
      name
    };

    // Make a POST request to fetch the product
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // Set the fetched product data to the state
        setWorkflow(data);
      })
      .catch((error) => {
        console.error('Error fetching workflow:', error);
      });
  }, [clientNr, explorerId, productName, name]);

  const handleDescriptionChange = (event) => {
    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
      description: event.target.value,
    }));
  };

  const handleUpdate = async () => {
    const apiUrl = process.env.REACT_APP_CENTRAL_BACK + '/workflow/update';

    // Define the request body
    const requestBody = {
      clientNr: clientNr,
      explorerId: explorerId,
      productName:productName,
      name:name,
      description: workflow.description
    };

      const myResponse = await axios.post(apiUrl, requestBody);
      alert("Workflow description was succesfully updated.");
  };

  const handleDelete = async () => {
    const apiUrl = process.env.REACT_APP_CENTRAL_BACK + '/workflow/delete';

    // Define the request body
    const requestBody = {
      clientNr: clientNr,
      explorerId: explorerId,
      productName:productName,
      name:name,
    };

      const myResponse = await axios.post(apiUrl, requestBody);
      alert("Workflow was succesfully removed.");
      updateTreeView();

  };

  return (
    <div className="Workflowview">
      <div>
        
        {workflow ? (
          <div>
            <div>
              <label htmlFor="workflowName">Workflow Name</label>
              <br />
              <input
                type="text"
                id="workflowName"
                value={workflow.name}
                className="WorkflowViewinputname"
                disabled
              />
            </div>
            <div>
              <label htmlFor="workflowDescription">Description</label>
              <br />
              <br />
              <textarea
                id="workflowDescription"
                value={workflow.description}
                className="Workflowviewinput"
                onChange={handleDescriptionChange}
                rows= "10"
                disabled={!designerMode }
                style={{ maxHeight: "200px", overflowY: "auto", width: "800px" }}
              />
            </div>
          </div>
        ) : (
          <p>Loading Workflow information...</p>
        )}
      </div>
      {designerMode && (
              <div>
                <button className = "actionbutton" onClick={handleUpdate}>Update</button>
                <button className = "actionbutton" onClick={handleDelete}>Remove</button>
              </div>
            )}
    </div>
  );
}

export default Workflowview;
