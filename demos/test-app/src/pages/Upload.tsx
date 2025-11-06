import { useState } from "react";
import "./Upload.css";

function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ message: string; filename: string; size: number } | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container" role="main">
      <h1>File Upload</h1>
      <p className="upload-subtitle">Upload a file to test file handling</p>

      <div className="upload-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="file-input">Select File</label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              aria-describedby="file-help"
            />
            <small id="file-help">Choose any file to upload</small>
          </div>

          {file && (
            <div className="file-info">
              <p>
                <strong>Selected:</strong> {file.name}
              </p>
              <p>
                <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
              </p>
              <p>
                <strong>Type:</strong> {file.type || "Unknown"}
              </p>
            </div>
          )}

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {result && (
            <div className="success-message" role="alert">
              <p>{result.message}</p>
              <p>
                <strong>Filename:</strong> {result.filename}
              </p>
              <p>
                <strong>Size:</strong> {(result.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <button type="submit" disabled={!file || uploading} className="upload-button">
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;

