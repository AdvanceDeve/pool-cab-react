import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useNavigate } from "react-router-dom";
import { BG_WHITE, API_URL, checkSessionToken } from "../utility/Utils";
const DocumentUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [message, setMessage] = useState("");
  const [userId, setUserid] = useState("");
  const [docType, setDocType] = useState("");
  let token = sessionStorage.getItem("token");
  useEffect(() => {
    const _userDetail = sessionStorage.getItem("userDetail");
    if (_userDetail && _userDetail !== "undefined") {
      const parsed = JSON.parse(_userDetail);
      setUserid(parsed.id);
    }
  }, []); // Only run on mount
  
  useEffect(() => {
    if (userId) {
      getDocument(userId);
    }
  }, [userId]); // Run only when userId changes
  

  const getDocument = async (userId) => {
    try {
      
     
      const res = await axios.post(
        `${API_URL}document/getFiles/`,
        {
          id:userId
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUploadedDoc(res.data);
    } catch (err) {
      setMessage("No document found or error fetching document.");
      setUploadedDoc(null);
    }
  };

  const uploadDocument = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("user_id", userId);
    formData.append("doc_type", docType);

    try {
      const res = await axios.post(`${API_URL}upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      });
      setMessage("File uploaded successfully.");
      setSelectedFile(null);
      setDocType("");
      
      // 🔄 Refresh uploaded documents
      getDocument(userId);
    } catch (err) {
      setMessage("Error uploading file.");
    }
  };

  return (
    <div className="container mt-4">
      <Link to="/Profile" className="btn btn-secondary mb-5">
        ←
      </Link>
      <h4>Upload Document</h4><p>(Driving Licence and RC Book)</p>

      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-3">
        <label className="form-label">Select Document Type</label>
        <select
          className="form-control"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
        >
          <option value="">-- Select Document Type --</option>
          <option value="license">Driving License</option>
          <option value="rcbook">RC Book</option>

        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Select File</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
      </div>
      

      <button className="btn btn-primary" onClick={uploadDocument}>
        Upload
      </button>

      <hr />

      <h5>Uploaded Document Info</h5>
      {uploadedDoc && uploadedDoc.length > 0 ? (
        uploadedDoc.map((doc, index) => (
          <div key={index} className="card mt-2 p-3 mb-5" style={{ marginBottom:"80px" }} >
            <p><strong>Document Type:</strong> {doc.doc_type === 'license' ? 'Driving License' : doc.doc_type === 'rcbook' ? 'RC Book' : 'N/A'}</p>
            <p><strong>File Name:</strong> {doc.filename}</p>
            <p><strong>Uploaded At:</strong> {doc.uploaded_at}</p>

            {/* Image Preview */}
            {doc.fileType?.startsWith("image/") && (
              <img
                src={doc.url}
                alt={doc.filename}
                className="img-thumbnail mb-2"
                style={{ maxWidth: "200px", height: "auto"}}
              />
            )}

            {/* PDF Preview */}
            {doc.fileType === "application/pdf" && (
              <iframe
                src={doc.url}
                // src="http://127.0.0.1/1741772235326.pdf"
                title="PDF Preview"
                width="100%"
                height="300px"
                style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              ></iframe>
            )}

            {/* 📎 Other File Types */}
            {!doc.fileType?.startsWith("image/") && doc.fileType !== "application/pdf" && (
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary"
              >
                Download File
              </a>
            )}
          </div>
  ))
) : (
  <p>No document available for this user.</p>
)}


    </div>
  );
};

export default DocumentUploader;
