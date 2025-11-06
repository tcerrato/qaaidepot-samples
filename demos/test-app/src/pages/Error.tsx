import { useState, useEffect } from "react";
import "./Error.css";

function Error() {
  const [errorData, setErrorData] = useState<{ error: string; message: string; timestamp: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/error")
      .then((res) => res.json())
      .then((data) => {
        setErrorData(data);
        setLoading(false);
      })
      .catch((err) => {
        setErrorData({
          error: "Network Error",
          message: "Failed to fetch error data",
          timestamp: new Date().toISOString(),
        });
        setLoading(false);
      });
  }, []);

  return (
    <div className="error-container" role="main">
      <h1>Error Page</h1>
      <p className="error-subtitle">This page demonstrates error handling and assertions</p>

      <div className="error-card">
        {loading ? (
          <div className="loading">Loading error data...</div>
        ) : errorData ? (
          <>
            <div className="error-header">
              <h2>500 Internal Server Error</h2>
            </div>
            <div className="error-content">
              <p className="error-type">
                <strong>Error:</strong> {errorData.error}
              </p>
              <p className="error-message">
                <strong>Message:</strong> {errorData.message}
              </p>
              <p className="error-timestamp">
                <strong>Timestamp:</strong> {new Date(errorData.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="error-note">
              <p>
                AI agents should assert on the error message: <strong>"{errorData.message}"</strong>
              </p>
            </div>
          </>
        ) : (
          <div className="error-message">No error data available</div>
        )}
      </div>
    </div>
  );
}

export default Error;

