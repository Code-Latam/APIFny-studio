import React, { useState, useEffect } from 'react';
import './chatbot.css';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


const Chatbot = ({clientNr}) => {
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

      if (prompt !== '') {
        const requestData = {
          clientNr: '111111',
          gwoken: 'saasasasas',
          chatbotKey: user.chatbotKey,
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
              body: JSON.stringify(requestData),
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
          style={{  width: "100%", height:"50px" }}
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
