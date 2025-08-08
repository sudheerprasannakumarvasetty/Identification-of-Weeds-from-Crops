import React, { useState, useRef } from "react";

export default function WeedDetection() {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);

  const API_URL =
    "https://detect.roboflow.com/maize_weed_dataset-brv9k/1?api_key=55gEnBgXjnHpsp0ha1ds";

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const sendImage = () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    fetch(API_URL, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => drawResults(data))
      .catch((err) => console.error(err));
  };

  const drawResults = (data) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      data.predictions.forEach((pred) => {
        const { x, y, width, height, class: label } = pred;

        ctx.strokeStyle = label === "weed" ? "red" : "blue";
        ctx.lineWidth = 3;
        ctx.strokeRect(x - width / 2, y - height / 2, width, height);

        ctx.fillStyle = ctx.strokeStyle;
        ctx.font = "20px Arial";
        ctx.fillText(label, x - width / 2, y - height / 2 - 5);
      });
    };
    img.src = URL.createObjectURL(image);
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h1>🌱 Weed Detection (YOLO)</h1>
      <p>Upload an image to detect crops (blue) and weeds (red).</p>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <br />
      <button onClick={sendImage}>Detect Weeds</button>

      <br />
      <canvas ref={canvasRef} style={{ border: "2px solid black", marginTop: "10px" }}></canvas>
    </div>
  );
}
