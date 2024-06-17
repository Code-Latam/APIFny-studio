import React, { useState, useEffect } from 'react';
import "./thirdparties.css";
import axios from "axios";

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/material.css';
import CustomTooltip from '../../tooltips/CustomTooltip';
import tooltips from '../../tooltips/tooltips';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import {encodebody, getDecodedBody} from "../../utils/utils.js";

// CRUDTableComponent.jsx



const Thirdparties = ({clientNr, explorerId, onClose}) => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    clientNr: clientNr,
    name: '',
    description: '',
    yaml: '',
  });

  useEffect(() => {
    // Fetch all records when the component mounts
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const payload = 
    {
        clientNr:clientNr
    }
    try {
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/thirdparties/queryall', encodebody(payload));
      setRecords(getDecodedBody(response.data));
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
    setFormData(record);
  };

  const handleDeleteRecord = async () => {
    const payload = {
        clientNr: clientNr,
        name: selectedRecord.name
    }
    try {
      await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/thirdparties/delete', encodebody(payload));
      fetchRecords();
      setSelectedRecord(null);
      setFormData({
        clientNr: clientNr,
        name: '',
        description: '',
        yaml: '',
      });
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleUpdateRecord = async () => {
    try {
      await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/thirdparties/update', encodebody(formData));
      fetchRecords();
      setSelectedRecord(null);
      setFormData({
        clientNr: clientNr,
        name: '',
        description: '',
        yaml: '',
      });
    } catch (error) {
      alert('Error updating third party. Please check your fields');
    }
  };

  const handleAddRecord = async () => {
    try {
      await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/thirdparties/register', encodebody(formData));
      fetchRecords();
      setFormData({
        clientNr: clientNr,
        name: '',
        description: '',
        yaml: '',
      });
    } catch (error) {
      alert('Error adding third party. Please check your fileds');
    }
  };

  return (
    <div className="crud-table-container">
      <div className="top">
          <div className="left">Api Action</div>
          <div className="close" onClick={onClose}>
            &times;
          </div>
        </div>
    <div className = "thirdparty-table-container">
      <table>
        <thead>
          <tr>
            <th>Main Client</th>
            <th>Api Action Name</th>
            <th>Description</th>
           
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.clientNr} onClick={() => handleSelectRecord(record)}>
              <td>{record.clientNr}</td>
              <td>{record.name}</td>
              <td>{record.description}</td>
             
            </tr>
          ))}
        </tbody>
      </table>
      <Tippy content={<CustomTooltip content={tooltips.thirdparties.content} isHtml={tooltips.thirdparties.isHtml} />} placement="right" theme = "terminal" trigger ='click' interactive = "true" >
      <HelpCenterIcon/>
      </Tippy>
      </div>

      <div className="form-container">
        <form>
         
            <input
              className='client-input'
              type="text"
              value={formData.clientNr}
              onChange={(e) => setFormData({ ...formData, clientNr: e.target.value })}
            />
          <label>
           Api Action Name:
            <input
              className='thirdparty-input'
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </label>
          <label>
            Description:
            <input
              className='thirdparty-input'
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </label>
          <label>
            YAML:
            <textarea
              className="thirdpartyyaml"
              type="text"
              value={formData.yaml}
              onChange={(e) => setFormData({ ...formData, yaml: e.target.value })}
              rows= "20"
              style={{ maxHeight: "200px", overflowY: "auto", width: "800px" }}
            />
          </label>
        </form>

        <div className="button-container">
          {selectedRecord ? (
            <>
              <button className='thirdpartybutton' onClick={handleUpdateRecord}>Update</button>
              <button className='thirdpartybutton' onClick={handleDeleteRecord}>Delete</button>
              <button className='thirdpartybutton' onClick={onClose}>Close</button>
            </>
          ) : (
            <div>
            <button  className='thirdpartybutton' onClick={handleAddRecord}>Add</button>
            <button className="thirdpartybutton" onClick={onClose}>Close </button>
            </div>
          
          )}
        </div>
      </div>
    </div>
  );
};

export default Thirdparties;
