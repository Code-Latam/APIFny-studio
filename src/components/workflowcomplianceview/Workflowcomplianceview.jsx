import React, { useState, useEffect } from 'react';
import "./workflowcomplianceview.css";
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

function Workflowcomplianceview({ clientNr, explorerId, productName, name, authorization, updateTreeView  }) {
  const [workflow, setWorkflow] = useState(null);
  const [isRichTextMode, setIsRichTextMode] = useState(true);

  const [markdownContent, setMarkdownContent] = useState('');


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
        const markdownContent = htmlToMd(data.complianceDescription);
        setMarkdownContent(markdownContent);
      } catch (error) {
        console.error('Error fetching workflow:', error);
      }
    };

    fetchWorkflow();
  }, [clientNr, explorerId, productName, name]);

  const handleComplianceDescriptionChange = (value) => {
    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
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
    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
      complianceDescription: htmlString,
    }));
    setMarkdownContent(markdownContent);
  };


  const handleUpdate = async () => {
    const apiUrl = process.env.REACT_APP_CENTRAL_BACK + '/workflow/update';

    // Define the request body
    const requestBody = {
      clientNr: clientNr,
      explorerId: explorerId,
      productName:productName,
      name:name,
      complianceDescription: workflow.complianceDescription,
    };

      const myResponse = await axios.post(apiUrl, encodebody(requestBody));
      alert("Workflow was succesfully updated.");
  };


  return (
    <div className="Workflowcomplianceview">
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
      <Tippy content={<CustomTooltip content={tooltips.workflowComplianceDescription.content} isHtml={tooltips.workflowComplianceDescription.isHtml} />} placement="right" theme = "terminal" trigger ='click' interactive = "true" >      
      <HelpCenterIcon/>
      </Tippy>
      </div>
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
              <label htmlFor="workflowComplianceDescription">Compliance Description</label>
              <br />
              {isRichTextMode ? (
                 <div style={{ overflowY: "auto", marginTop: "10px" , marginBottom: "14px", border: "1px solid white" }}>
                <ReactQuill
                  value={workflow.complianceDescription}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link', 'image'],
                      ['clean'],
                    ],
                  }}
                  theme = "snow"
                  className="Taskviewinput"
                  onChange={handleComplianceDescriptionChange}
                  disabled = {!authorization.designer && !authorization.owner } 
                  readOnly =  {!authorization.designer && !authorization.owner }    
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
          <p>Loading Workflow information...</p>
        )}
      </div>
     
    </div>
  );
}

export default Workflowcomplianceview;
