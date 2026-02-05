import React, { useState } from "react";

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return setStatus("Select a file");
    setStatus("Indexing...");
    try {
      // Replace this with your actual uploadPDF API
      await new Promise((res) => setTimeout(res, 1000));
      setStatus("Success ✓");
    } catch {
      setStatus("Error");
    }
  };

  return (
    <div className="upload-section">
      <h3>Upload PDF</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>
        {status === "Indexing..." ? status : "Upload"}
      </button>
      {status && <p className="upload-status">{status}</p>}
    </div>
  );
}
