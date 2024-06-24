import React, { useState, useEffect } from 'react';
import "./taskview.css";
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

function Taskview({ clientNr, explorerId, workflowName, taskId, authorization,updateGraphView }) {

  
  const [task, setTask] = useState(null);
  const [selectedType, setSelectedType] = useState("circle");
  const [selectedTaskType, setSelectedTaskType] = useState("normal");
  const [selectedApi, setSelectedApi] = useState("");
  const [apis, setApis] = useState([]);

  const typeOptions = ["circle","cross","diamond","square","star","triangle","wye"];
  const taskTypeOptions = ["normal", "compliance"];
  const [isRichTextMode, setIsRichTextMode] = useState(true);

  const [markdownContent, setMarkdownContent] = useState('');

  const toggleDisplayMode = () => {
    setIsRichTextMode((prevMode) => !prevMode);
  };

  
  useEffect(() => {
    const fetchApisAndTask = async () => {
      const apiBaseUrl = process.env.REACT_APP_CENTRAL_BACK;
      
      // Fetch APIs
      const fetchApis = async () => {
        const myBody = {
          clientNr,
          explorerId,
        };
        try {
          const apisResponse = await axios.post(`${apiBaseUrl}/api/queryall`, encodebody(myBody));
          const myEmptyApi = { apiName: "" };
          const myApis = getDecodedBody(apisResponse.data);
          myApis.unshift(myEmptyApi);
          setApis(myApis);
        } catch (error) {
          console.error("Error fetching APIs:", error);
        }
      };

      // Fetch task
      const fetchTask = async () => {
        const requestBody = {
          clientNr,
          explorerId,
          workflowName,
          taskId,
        };
        
        try {
          const response = await axios.post(`${apiBaseUrl}/task/query`, encodebody(requestBody), {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = getDecodedBody(response.data);
          setTask(data);
          setSelectedType(data.symbolType);
          setSelectedTaskType(data.taskType);
          setSelectedApi(data.apiName);
          const markdownContent = htmlToMd(data.description);
          setMarkdownContent(markdownContent);
        } catch (error) {
          console.error('Error fetching task:', error);
        }
      };

      await fetchApis();
      await fetchTask();
    };

    fetchApisAndTask();
  }, [workflowName, taskId]);
  

 const handleDescriptionChange = (value) => {
  setTask((prevTask) => ({
    ...prevTask,
    description: value,
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
    description: htmlString,
  }));
  setMarkdownContent(markdownContent);
};

  const handleNameChange = (event) => {
    setTask((prevTask) => ({
      ...prevTask,
      name: event.target.value,
    }));

  };

  const handleUpdate = async () => {
    const apiUrl = process.env.REACT_APP_CENTRAL_BACK + '/task/update';

    // Define the request body
    const requestBody = {
      clientNr: clientNr,
      explorerId: explorerId,
      workflowName:workflowName,
      taskId:taskId,
      taskType: selectedTaskType,
      symbolType: selectedType,
      apiName: selectedApi,
      name:task.name,
      description: task.description
    };

      const myResponse = await axios.post(apiUrl, encodebody(requestBody));
      alert("Task was succesfully updated.");
      updateGraphView();

  };

  return (
    <div className="Taskview">
      <div>
        
        {task ? (
          <div >
            <div className = "left-top-buttons-productview">
            {(authorization.designer || authorization.owner) && (
            <button className='editorButton' onClick={toggleDisplayMode}>
              {isRichTextMode ? 'Use Markdown Editor' : 'Use Rich Text Editor'}
            </button>
          )}
      {   (authorization.designer || authorization.owner) && (
                <button className = 'editorButton' onClick={handleUpdate}>Update</button>
            
            )}
       <a href="https://wiki.gwocu.com/en/GWOCU-Studio/tasks-detail-panel" target="_blank" rel="noopener noreferrer">
                        <HelpCenterIcon />
            </a>
      </div>     
            <div>
              <label htmlFor="taskName">Task Name</label>
              <input
                type="text"
                id="taskName"
                value={task.name}
                onChange={handleNameChange}
                disabled={!authorization.designer && !authorization.owner }
                className="LinkTViewType"
              />
            </div>
            <div className = "taskcontainer"> 
            <div className='taskcontaineritem'>
            <label htmlFor="taskType">Task Type</label>
              <select
                id="taskType"
                value={selectedTaskType}
                className="LinkTViewType"
                onChange={(e) => setSelectedTaskType(e.target.value)}
                disabled={!authorization.designer && !authorization.owner }
              >
                {taskTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className='taskcontaineritem'>
            <label htmlFor="api">Implements API:</label>
              <select
                id="api"
                value={selectedApi}
                className="apilist"
                onChange={(e) => setSelectedApi(e.target.value)}
                disabled= {!authorization.designer && !authorization.owner }
              >
                {apis.map((api) => (
                  <option key={api.name} value={api.name}>
                    {api.name}
                  </option>
                ))}
              </select>
            </div>      
            </div>
               
            <div>
            <label htmlFor="nodeType">node Type</label>
              <select
                id="nodeType"
                value={selectedType}
                className="LinkTViewType"
                onChange={(e) => setSelectedType(e.target.value)}
                disabled= {!authorization.designer && !authorization.owner }
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="workflowDescription">Description</label>
              {isRichTextMode ? (
                 <div style={{ overflowY: "auto", marginTop: "10px" , marginBottom: "14px", border: "1px solid white" }}>
                <ReactQuill
                  value={task.description}
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
                  onChange={handleDescriptionChange}
                  readOnly =  {!authorization.designer && !authorization.owner }  
                  disabled = {!authorization.designer && !authorization.owner }
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
          <p>Loading Task information...</p>
        )}
      </div>
       
    </div>
  );
}

export default Taskview;
