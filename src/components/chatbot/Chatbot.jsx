import React, { useState, useEffect } from 'react';
import './chatbot.css';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';
import {encodebody, getDecodedBody} from "../../utils/utils.js";


const Chatbot = ({clientNr, explorerId}) => {
  const { user } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);

  const removeNewlines = (text) => {
    return text.replace(/\\n/g, ''); // Remove "\n" characters
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission behavior

      const prompt = inputValue.trim();
      console.log("USER CONTEXT");
      console.log(user);
      let targetChatbot;
      // determine which chatbot to use:
      try {
          console.log("IN CHATBOT");
          console.log({
            clientNr:user.clientNr, explorerId: explorerId
          })
          const chatbotexplorerrel = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/chatbotexplorerrel/query", 
          encodebody({
            clientNr:user.clientNr, explorerId: explorerId
          }));
        
          
          if (user.groups.includes('apiFnyDesigners') || user.groups.includes('apiOwners')) 
          {
            targetChatbot = chatbotexplorerrel.data.chatbotKeyDesigner
          }
          else if (user.groups.includes('apiFnyDesigners'))
          {
            targetChatbot = chatbotexplorerrel.data.chatbotKeyReader
          }
          else
          { 
            alert("user does not have rights to access to any chatbot.")
            return;
          }
    }
    catch(err)
    {
      alert("No chatbot related to this workspace.")
      return;
    }


      if (prompt !== '') {
        const requestData = {
          clientNr: '111111',
          gwoken: 'saasasasas',
          chatbotKey: targetChatbot,
          prompt: prompt,
        };

        try {
          const response = await fetch(
            'https://base-configuration.azurewebsites.net/api/chat/ask',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(encodebody(requestData)),
            }
          );

          const responseBody = await response.text();
          const cleanedResponse = removeNewlines(responseBody)
            .replace(/.*ANSWER: /g, '') // Remove the "ANSWER: " prefix
            .replace(/"/g, ''); // Remove quotation marks

          setResponse(''); // Clear previous content
          setShowResponse(true);

          for (let i = 0; i < cleanedResponse.length; i++) {
            setTimeout(() => {
              setResponse((prevResponse) => prevResponse + cleanedResponse[i]);
            }, i * 20); // Adjust the delay for faster typing speed
          }

          setInputValue(''); // Clear the input field
        } catch (error) {
          console.error('Error:', error);
        }
      }
    } else {
      // Hide the response container when typing in the input field
      setShowResponse(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', () => {
      // Focus the input field when the document is clicked
      // document.getElementById('input-field').focus();
    
    });
  }, []);

  return (
    <div className="chat-container">
      
        <textarea 
          id="chatbot-input-field"
          rows="3"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{  width: "100%", height:"55px" }}
          placeholder="Let’s discuss our product, compliance, APIs, or coding challenges. Type your query and press ‘Enter’ to engage."
        />
      <div 
        id="response-container" 
        className="show-response"
        style={{  width: "100%", height:"70%" }}
        >
        {response}
      </div>
     

    </div>
  );
};

export default Chatbot;
