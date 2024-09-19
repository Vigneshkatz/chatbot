import React, { useState } from 'react';
import axios from 'axios';
import Chatbot from './Chatbot'; // Import Chatbot component
import chatbotIcon from '../image/image.png'; // Replace with the path to your chatbot icon
import Loader from './Loader'; // Import the Loader component

const UploadPDF = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [showChatIcon, setShowChatIcon] = useState(false); // Show chatbot icon after successful upload
  const [showChatWindow, setShowChatWindow] = useState(false); // Toggle chat window
  const [loading, setLoading] = useState(false); // Add loading state

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true); // Start loading

    try {
      const response = await axios.post('https://chatbotv2-758892558646.asia-south1.run.app/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setMessage(response.data.message); // Success message
        setShowChatIcon(true); // Show chatbot icon after successful upload
      }
    } catch (error) {
      setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Toggle the chat window on chatbot icon click
  const handleChatIconClick = () => {
    setShowChatWindow((prevState) => !prevState);
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>Upload</button>
      </form>
      {message && <p>{message}</p>}

      {/* Show loader */}
      {loading && <Loader />}

      {/* Show the chatbot icon after the PDF is uploaded */}
      {showChatIcon && (
        <>
          {/* Chatbot icon (bigger size) */}
          <img
            src={chatbotIcon}
            alt="Chatbot"
            style={{
              width: '70px',
              height: '70px',
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              cursor: 'pointer',
            }}
            onClick={handleChatIconClick}
          />

          {/* Chat window (white box) */}
          {showChatWindow && (
            <div
              style={{
                position: 'fixed',
                bottom: '80px',
                right: '20px',
                width: '350px',
                height: '450px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Chatbot />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UploadPDF;
