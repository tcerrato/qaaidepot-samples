import "./Iframe.css";

function Iframe() {
  return (
    <div className="iframe-container" role="main">
      <h1>Iframe Demo</h1>
      <p className="iframe-subtitle">This page contains an embedded iframe</p>

      <div className="iframe-wrapper">
        <iframe
          src="/iframe-content.html"
          title="Embedded Content"
          className="demo-iframe"
          sandbox="allow-same-origin allow-scripts"
          aria-label="Embedded iframe content"
        />
      </div>

      <div className="iframe-info">
        <p>This iframe embeds a simple HTML page for testing iframe interactions.</p>
      </div>
    </div>
  );
}

export default Iframe;

