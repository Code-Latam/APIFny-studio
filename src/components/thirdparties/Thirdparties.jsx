import React, { useState, useEffect } from 'react';
import "./thirdparties.css";
import axios from "axios";

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
      const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/thirdparties/queryall', payload);
      setRecords(response.data);
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
      await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/thirdparties/delete', payload);
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
      await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/thirdparties/update', formData);
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
      await axios.post(process.env.REACT_APP_CENTRAL_BACK + '/thirdparties/register', formData);
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
      <table>
        <thead>
          <tr>
            <th>Main Client</th>
            <th>Third Party Name</th>
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

      <div className="form-container">
        <form>
         
            <input
              className='client-input'
              type="text"
              value={formData.clientNr}
              onChange={(e) => setFormData({ ...formData, clientNr: e.target.value })}
            />
          <label>
            Name:
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
