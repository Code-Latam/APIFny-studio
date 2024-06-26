import React, { useState, useEffect } from 'react';
import "./workflowview.css";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import htmlToMd from 'html-to-md';
import ReactMarkdown from 'react-markdown';
import { renderToString } from 'react-dom/server';
import Modalworkflowclone from "../modalworkflowclone/Modalworkflowclone"; 

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/material.css';
import CustomTooltip from '../../tooltips/CustomTooltip';
import tooltips from '../../tooltips/tooltips';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import {getDecodedBody, encodebody} from "../../utils/utils.js";

function Workflowview({ clientNr, explorerId, productName, name, authorization, updateTreeView  }) {
  const [workflow, setWorkflow] = useState(null);
  const [isRichTextMode, setIsRichTextMode] = useState(true);

  const [markdownContent, setMarkdownContent] = useState('');

  const [isWorkflowCloneModalOpen, setIsWorkflowCloneModalOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("Private");

  const statusOptions = ["Private","Public"];

  const toggleDisplayMode = () => {
    setIsRichTextMode((prevMode) => !prevMode);
  };


  useEffect(() => {
    const fetchWorkflow = async () => {
      const apiUrl = process.env.REACT_APP_CENTRAL_BACK + '/workflow/query';

      const requestBody = {
        clientNr,
        explorerId,
        productName,
        name,
      };

      try {
        const response = await axios.post(apiUrl, encodebody(requestBody), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = getDecodedBody(response.data);
        setWorkflow(data);
        setSelectedStatus(data.status);
        const markdownContent = htmlToMd(data.description);
        setMarkdownContent(markdownContent);
      } catch (error) {
        console.error('Error fetching workflow:', error);
      }
    };

    fetchWorkflow();
  }, [clientNr, explorerId, productName, name]);

  const handleDescriptionChange = (value) => {
    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
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
      setWorkflow((prevWorkflow) => ({
        ...prevWorkflow,
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
    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
      description: htmlString,
    }));
    setMarkdownContent(markdownContent);
  };

  const handleClone = () => {
    setIsWorkflowCloneModalOpen(true);
  };

  const handleUpdate = async () => {
    const apiUrl = process.env.REACT_APP_CENTRAL_BACK + '/workflow/update';

    // Define the request body
    const requestBody = {
      clientNr: clientNr,
      explorerId: explorerId,
      productName:productName,
      name:name,
      description: workflow.description,
      sequence: workflow.sequence,
      status: selectedStatus,
    };

      const myResponse = await axios.post(apiUrl, encodebody(requestBody));
      alert("Workflow was succesfully updated.");
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

      const myResponse = await axios.post(apiUrl, encodebody(requestBody));
      alert("Workflow was succesfully removed.");
      window.location.reload();
      // updateTreeView();

  };

  const handleCopy = () => {
    const selectedText = quillRef.current.getEditor().getSelection();
    if (selectedText) {
      // document.execCommand('copy');
    }
  };

  const handleCut = () => {
    const selectedText = quillRef.current.getEditor().getSelection();
    if (selectedText) {
      // document.execCommand('cut');
    }
  };

  const handlePaste = () => {
    // document.execCommand('paste');
  };

  return (
    <div className="Workflowview">
      <div>      
        {workflow ? (
         <div> 
      <div className='left-top-buttons-workflowview'>   
      {(authorization.designer || authorization.owner) && (
        <button className='editorButton' onClick={toggleDisplayMode}>
          {isRichTextMode ? 'Use Markdown Editor' : 'Use Rich Text Editor'}
        </button>
      )}
      {(authorization.designer || authorization.owner) && (
                <button className = "actionbutton" onClick={handleUpdate}>Update</button>
            )}
      {(authorization.designer || authorization.owner) && (          
                <button className = "actionbutton" onClick={handleDelete}>Remove</button>
            )}
      {(authorization.designer || authorization.owner) && (
                <button className = "actionbutton" onClick={handleClone}>Clone</button>
            )}
      <a href="https://wiki.gwocu.com/en/GWOCU-Studio/workflows-detail-panel" target="_blank" rel="noopener noreferrer">
                        <HelpCenterIcon />
            </a>  
      </div>
      <div>
      {isWorkflowCloneModalOpen && (
        <Modalworkflowclone
          clientNr = {clientNr}
          explorerId = {explorerId}
          SourceProductName = {productName}
          sourceWorkflowName = {name}
          onClose={() => {
            setIsWorkflowCloneModalOpen(false);
          }}
        />
        
      )}   
      </div> 
      
            <div className = "input-container">
              <label className='input-label' htmlFor="workflowName">Workflow Name:</label>
              <br />
              <input
                type="text"
                id="workflowName"
                value={workflow.name}
                className="WorkflowViewNameinput"
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
                disabled= {!authorization.designer && !authorization.owner }
              >
                {statusOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className = "input-container">
              <label className='input-label' htmlFor="sequence">Sequence:</label>
              <br />
              <input
                type="text"
                id="sequence"
                value={workflow.sequence}
                className="WorkflowViewSequenceinput"
                onChange={handleSequenceChange}
                disabled = {!authorization.designer && !authorization.owner } 
          
              />
            </div>
            <div>
              <label htmlFor="workflowDescription">Description:</label>
              <br />
              {isRichTextMode ? (
                 <div style={{ overflowY: "auto", marginTop: "10px" , marginBottom: "14px", border: "1px solid white" }}>
                <ReactQuill
                  value={workflow.description}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      ['blockquote', 'code-block'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link' ],
                      ['clean','image'],
                    
                    ],
                  }}
                  theme = "snow"
                
                  onChange={handleDescriptionChange}
                  disabled = {!authorization.designer && !authorization.owner } 
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
              )}
            </div>
          </div>
        ) : (
          <p>Loading Workflow information...</p>
        )}
      </div>
     
    </div>
  );
}

export default Workflowview;
