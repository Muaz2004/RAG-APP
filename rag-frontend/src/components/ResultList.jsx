import React from "react";

function ResultList({ results }) {
  return (
    <div>
      <h3>Retrieved Chunks</h3>

      {results.map((chunk, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <strong>Result {i + 1}</strong>
          <p>{chunk}</p>
        </div>
      ))}
    </div>
  );
}

export default ResultList;
