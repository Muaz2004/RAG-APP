const API_BASE = "http://127.0.0.1:8000/api"; // make sure /api matches Django

export const uploadPDF = async (file) => {
  try {
    const formData = new FormData();
    formData.append("pdf", file);
    console.log("FormData prepared:", formData.get("pdf")); // <-- debug

    const res = await fetch(`${API_BASE}/upload/`, {
      method: "POST",
      body: formData,
    });

    console.log("Raw fetch response:", res); // <-- debug
    const data = await res.json();
    console.log("Parsed JSON:", data); // <-- debug
    return { message: data.status || data.error };
  } catch (err) {
    console.error("Upload fetch error:", err); // <-- debug
    return { message: "Upload failed" };
  }
};

export const queryRAG = async (question) => {
  try {
    const res = await fetch(`${API_BASE}/query/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    console.log("Query raw response:", res); // <-- debug
    const data = await res.json();
    console.log("Query parsed JSON:", data); // <-- debug
    return data;
  } catch (err) {
    console.error("Query fetch error:", err);
    return { results: [], error: "Query failed" };
  }
};
