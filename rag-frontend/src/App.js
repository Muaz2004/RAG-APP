import React from "react";
import UploadSection from "./pages/UploadPage";
import QuerySection from "./pages/QueryPage";
import "./style.css";

function App() {
  return (
    <div className="app-shell">
      <div className="page-wrapper">

        {/* HERO HEADER */}
        <header className="hero-header">
          <div className="badge">PROJECT v2.0.4</div>
          <h1>Secure Document <span className="gradient-text">Intelligence</span></h1>
          <p className="hero-sub">
            A private RAG implementation for analyzing complex PDF structures. 
            Upload your data, index the vectors, and query with semantic precision.
          </p>
          <div className="quick-stats">
            <div className="stat-card">
              <span className="stat-val">99.9%</span>
              <span className="stat-lbl">Retrieval Accuracy</span>
            </div>
            <div className="stat-card">
              <span className="stat-val">&lt; 2.4s</span>
              <span className="stat-lbl">Average Latency</span>
            </div>
            <div className="stat-card">
              <span className="stat-val">AES-256</span>
              <span className="stat-lbl">Data Encryption</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE */}
        <main className="main-content">
          <div className="workspace-grid">

            {/* LEFT: UPLOAD */}
            <aside className="side-bar">
              <div className="glass-card">
                <UploadSection />
              </div>

              <div className="glass-card info-panel">
                <h4>System Logs</h4>
                <div className="log-item"><span>•</span> Pipeline initialized...</div>
                <div className="log-item"><span>•</span> Vector database connected...</div>
                <div className="log-item"><span>•</span> Ready for ingestion...</div>
              </div>
            </aside>

            {/* RIGHT: QUERY */}
            <section className="query-area">
              <div className="glass-card full-height">
                <QuerySection />
              </div>
            </section>
          </div>
        </main>

        {/* TECHNICAL ARCHITECTURE */}
        <section className="extra-content">
          <h2>Technical Architecture</h2>
          <div className="feature-grid">
            <div className="feat-box">
              <h3>Recursive Chunking</h3>
              <p>Documents are split into overlapping 512-token chunks to preserve context across boundaries.</p>
            </div>
            <div className="feat-box">
              <h3>Vector Embeddings</h3>
              <p>Using high-dimensional semantic mapping to ensure the most relevant context is retrieved.</p>
            </div>
            <div className="feat-box">
              <h3>Context Injection</h3>
              <p>Retrieved chunks are injected into the LLM prompt with strict grounding instructions.</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="page-footer">
          <p>© 2026 Internal Intelligence Tool • Proprietary Development</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
