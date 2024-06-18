// JiraServiceDeskModal.js
import React from 'react';
import './JiraServiceDeskModal.css';

const JiraServiceDeskModal = ({ onClose }) => {
  const jiraServiceDeskUrl = 'https://customers.support.gwocu.com';

  const handleOpenJira = () => {
    window.open(jiraServiceDeskUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>Close</button>
        <button onClick={handleOpenJira}>Open Jira Service Desk</button>
      </div>
    </div>
  );
};

export default JiraServiceDeskModal;

