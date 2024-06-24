import React, { useState, useEffect } from 'react';
import "./taskcomplianceview.css";
import axios from "axios";
import ReactQuill from 'react-quill';
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
function Taskcomplianceview({ clientNr, explorerId, workflowName, taskId, authorization,updateGraphView }) {

  
  const [task, setTask] = useState(null);


  const [isRichTextMode, setIsRichTextMode] = useState(true);

  const [markdownContent, setMarkdownContent] = useState('');

  const toggleDisplayMode = () => {
    setIsRichTextMode((prevMode) => !prevMode);
  };

  

  useEffect(() => {
    const fetchTask = async () => {
      const apiUrl = `${process.env.REACT_APP_CENTRAL_BACK}/task/query`;

      // Define the request body
      const requestBody = {
        clientNr,
        explorerId,
        workflowName,
        taskId,
      };

      console.log(requestBody);

      try {
        // Make a POST request to fetch the task
        const response = await axios.post(apiUrl, encodebody(requestBody), {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = getDecodedBody(response.data);
        // Set the fetched product data to the state
        setTask(data);
        // Set the markdown
        const markdownContent = htmlToMd(data.complianceDescription);
        setMarkdownContent(markdownContent);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [workflowName, taskId]); // Dependency array ensures the effect runs when these variables change


 const handleComplianceDescriptionChange = (value) => {
  setTask((prevTask) => ({
    ...prevTask,
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
  setTask((prevTask) => ({
    ...prevTask,
    complianceDescription: htmlString,
  }));
  setMarkdownContent(markdownContent);
};


  const handleUpdate = async () => {
    const apiUrl = process.env.REACT_APP_CENTRAL_BACK + '/task/update';

    // Define the request body
    const requestBody = {
      clientNr: clientNr,
      explorerId: explorerId,
      workflowName:workflowName,
      taskId:taskId,
      complianceDescription: task.complianceDescription
    };

      const myResponse = await axios.post(apiUrl, encodebody(requestBody));
      alert("Task was succesfully updated.");

  };

  return (
    <div className="Taskview">
            <div>
              
              {task ? (
                <div>
                  <div className = "left-top-buttons-productview">
            {(authorization.designer || authorization.owner) && (
              <button className='editorButton' onClick={toggleDisplayMode}>
                {isRichTextMode ? 'Use Markdown Editor' : 'Use Rich Text Editor'}
              </button>
            )}
            {(authorization.designer || authorization.owner) && (
                
                      <button className = 'editorButton' onClick={handleUpdate}>Update</button>
                  
                  )}
             <a href="https://wiki.gwocu.com/en/GWOCU-Studio/tasks-detail-panel#taskcompliance-section" target="_blank" rel="noopener noreferrer">
                        <HelpCenterIcon />
            </a>
            </div>
            <div>
              <label htmlFor="taskName">Task Name</label>
              <br />
              <input
                type="text"
                id="taskName"
                value={task.name}
                className="ComplianceTaskViewinputname"
                disabled
              />
            </div>
            <div>
              <label htmlFor="workflowDescription">Compliance Description</label>
              <br />
              {isRichTextMode ? (
                 <div style={{ overflowY: "auto", marginTop: "10px" , marginBottom: "14px", border: "1px solid white" }}>
                <ReactQuill
                  value={task.complianceDescription}
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
                 
                  onChange={handleComplianceDescriptionChange}
                  readOnly =  {!authorization.designer && !authorization.owner}  
                  disabled = {!authorization.designer && !authorization.owner}
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
          <p>Loading Task information...</p>
        )}
      </div>
      
    </div>
  );
}

export default Taskcomplianceview;
