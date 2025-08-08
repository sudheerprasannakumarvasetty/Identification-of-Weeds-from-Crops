import React, { useRef, useState } from "react";

/**
 * Replace API_URL below with:
 * - Your Roboflow workflow/model endpoint (example)
 *   "https://detect.roboflow.com/maize_weed_dataset-brv9k/1?api_key=YOUR_KEY"
 * - OR your self-hosted backend: "https://my-backend.com/predict"
 */
const API_URL = "https://detect.roboflow.com/maize_weed_dataset-brv9k/1?api_key=55gEnBgXjnHpsp0ha1ds";

export default function WeedDetection() {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  function handleFiles(files) {
    setError("");
    if (!files || !files[0]) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    setFile(f);
    setPredictions([]);
    // Draw preview immediately
    const url = URL.createObjectURL(f);
    if (imgRef.current) imgRef.current.src = url;
  }

  function onDrop(e) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }
  function onDragOver(e) { e.preventDefault(); }

  async function sendImage() {
    if (!file) {
      setError("Please choose an image first.");
      return;
    }
    setLoading(true);
    setError("");
    setPredictions([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(API_URL, { method: "POST", body: formData });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error("Server error: " + (txt || res.status));
      }
      const data = await res.json();

      /**
       * Roboflow prediction format usually:
       * data.predictions = [{x, y, width, height, class, confidence}, ...]
       * If your backend returns a different structure, adapt parsing here.
       */
      const preds = data.predictions || [];
      setPredictions(preds);
      drawCanvas(preds);
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Check console & API URL/key.");
    } finally {
      setLoading(false);
    }
  }

  function drawCanvas(preds = []) {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Clear and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw each prediction
    preds.forEach((p) => {
      // Roboflow returns center-based coordinates. Adapt if different.
      const cx = p.x;
      const cy = p.y;
      const w = p.width;
      const h = p.height;
      const x = cx - w / 2;
      const y = cy - h / 2;

      const isWeed = (p.class === "weed" || p["class"] === "1" || p.label === "weed");
      ctx.lineWidth = Math.max(2, Math.round(canvas.width / 300));
      ctx.strokeStyle = isWeed ? "rgba(255,80,80,0.95)" : "rgba(80,150,255,0.95)";
      ctx.fillStyle = ctx.strokeStyle;

      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.stroke();

      // label background
      const text = `${p.class || p.label || "obj"} ${(p.confidence || p.conf || 0).toFixed(2)}`;
      ctx.font = `${Math.max(12, Math.round(canvas.width / 80))}px Inter, Arial`;
      const textWidth = ctx.measureText(text).width;
      const pad = 6;
      ctx.fillRect(x, y - (parseInt(ctx.font) + pad), textWidth + pad * 2, parseInt(ctx.font) + pad);
      ctx.fillStyle = "#000";
      ctx.fillText(text, x + pad, y - pad / 2);
    });
  }

  return (
    <div className="container">
      <div className="panel glass">
        <h1 className="title">🌱 Maize & Weed Detector</h1>
        <p className="subtitle">Upload or drag an image. Red = weed, Blue = maize.</p>

        <div
          className="dropzone"
          onDrop={onDrop}
          onDragOver={onDragOver}
          role="button"
          tabIndex={0}
        >
          <input
            id="fileinput"
            type="file"
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: "none" }}
          />
          <div className="dropzone-inner" onClick={() => document.getElementById("fileinput").click()}>
            <svg className="upload-icon" viewBox="0 0 24 24" width="36" height="36">
              <path fill="currentColor" d="M19 15v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4" />
              <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="7 10 12 5 17 10" />
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div>
              <strong>Click to upload</strong> or drag & drop
            </div>
            <div className="hint">Supported: jpg, png, webp</div>
          </div>
        </div>

        <div className="controls">
          <button className="btn" onClick={sendImage} disabled={loading}>
            {loading ? <span className="loader" /> : "Detect"}
          </button>
          <button
            className="btn secondary"
            onClick={() => {
              setFile(null);
              setPredictions([]);
              setError("");
              if (imgRef.current) {
                imgRef.current.src = "";
                const ctx = canvasRef.current?.getContext("2d");
                if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              }
            }}
          >
            Reset
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="preview-area">
          <div className="img-wrap">
            <img ref={imgRef} alt="preview" className="preview-img" onLoad={() => drawCanvas(predictions)} />
            <canvas ref={canvasRef} className="preview-canvas" />
          </div>

          <div className="info-panel glass small">
            <h3>Detections</h3>
            <div className="table">
              {predictions.length === 0 ? (
                <div className="muted">No detections yet</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Class</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map((p, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{p.class || p.label || "obj"}</td>
                        <td>{((p.confidence || p.conf || 0) * 1).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="meta muted">
              Tip: Replace <code>API_URL</code> in <code>WeedDetection.jsx</code> with your API endpoint.
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">Built by SudheerVasetty</footer>
    </div>
  );
}
