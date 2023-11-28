import React, { useState, useEffect } from 'react';
import "./productview.css";
import axios from "axios";

function Productview({ clientNr, explorerId, productName, designerMode, updateTreeView }) {
  const [product, setProduct] = useState(null);

  const handleDescriptionChange = (event) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      description: event.target.value,
    }));
  };


  const handleUpdate = async () => {
    const apiUrl = process.env.REACT_APP_CENTRAL_BACK + '/product/update';

    // Define the request body
    const requestBody = {
      clientNr: clientNr,
      explorerId: explorerId,
      
      productName:product.productName,
      description: product.description
    };

      const myResponse = await axios.post(apiUrl, requestBody);
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

      const myResponse = await axios.post(apiUrl, requestBody);
      alert("Product was succesfully removed.");
      updateTreeView();

  };

  useEffect(() => {
    // Define the API URL for fetching the product
    const apiUrl = process.env.REACT_APP_CENTRAL_BACK + '/product/query';

    // Define the request body
    const requestBody = {
      clientNr,
      explorerId,
      productName,
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
        setProduct(data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
  }, [clientNr, explorerId, productName]);

  return (
    <div className="Productview">
      <div>
        
        {product ? (
          <div>
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
              <label htmlFor="productDescription">Description</label>
              <br />
              <br />
              <textarea
                id="productDescription"
                value={product.description}
                className="Productviewinput"
                onChange={handleDescriptionChange}
                rows= "10"
                disabled={!designerMode }
                style={{ maxHeight: "200px", overflowY: "auto", width: "800px" }}
              />
            </div>
          </div>
        ) : (
          <p>Loading product information...</p>
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

export default Productview;
