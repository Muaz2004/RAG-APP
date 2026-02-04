import { useState } from "react";
import { queryRAG } from "../services/ragApi";
import ResultList from "../components/ResultList";


function QueryPage() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState([]);

  const handleAsk = async () => {
    if (!question) return;

    const res = await queryRAG(question);
    setResults(res.results || []);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Ask Question</h2>

      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something..."
      />

      <button onClick={handleAsk}>Ask</button>

      <ResultList results={results} />
    </div>
  );
}

export default QueryPage;
