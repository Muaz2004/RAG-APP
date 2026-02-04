import { useState } from "react";
import { uploadPDF } from "../services/ragApi";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a PDF first");
      return;
    }

    console.log("Selected file:", file); 

    setStatus("Uploading...");
    try {
      const res = await uploadPDF(file);
      console.log("Upload response:", res); 
      setStatus(res.message || "Done");
    } catch (err) {
      console.error("Upload error:", err); 
      setStatus("Upload failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Document</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          console.log("File selected:", e.target.files[0]); 
          setFile(e.target.files[0]);
        }}
      />

      <button onClick={handleUpload}>Upload & Index</button>

      <p>{status}</p>
    </div>
  );
}

export default UploadPage;
