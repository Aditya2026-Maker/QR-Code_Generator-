import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import "./App.css";

function App() {
  const [type, setType] = useState("url");
  const [text, setText] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const qrRef = useRef(null);

  function validateInput(value) {
    if (!value.trim()) {
      return "Please enter something.";
    }

    if (type === "url") {
      try {
        const url = new URL(value);
        if (!["http:", "https:"].includes(url.protocol)) {
          return "Please enter a valid URL.";
        }
      } catch {
        return "Please enter a valid URL.";
      }
    }

    if (type === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(value)) {
        return "Please enter a valid email address.";
      }
    }

    if (type === "phone") {
      const phonePattern = /^[+0-9\s()-]{7,20}$/;

      if (!phonePattern.test(value)) {
        return "Please enter a valid phone number.";
      }
    }

    return "";
  }

  function handleInput(value) {
    setText(value);
    setError(validateInput(value));
  }

  function getQRValue() {
    if (type === "email") {
      return `mailto:${text}`;
    }

    if (type === "phone") {
      return `tel:${text}`;
    }

    return text;
  }

  function changeType(newType) {
    setType(newType);
    setText("");
    setError("");
  }

  function clearAll() {
    setText("");
    setError("");
  }

  function downloadQR() {
    if (error || !text) {
      setError("Enter valid information before downloading.");
      return;
    }

    const svg = qrRef.current.querySelector("svg");

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 300;
    canvas.height = 300;

    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 300, 300);

      const link = document.createElement("a");
      link.download = "my-qr-code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="container">

        <div className="top-bar">
          <div>
            <h1>QR Code Generator</h1>
            <p className="subtitle">
              Create and customize your QR code instantly
            </p>
          </div>

          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="type-buttons">
          <button onClick={() => changeType("url")}>🔗 URL</button>
          <button onClick={() => changeType("text")}>📝 Text</button>
          <button onClick={() => changeType("email")}>📧 Email</button>
          <button onClick={() => changeType("phone")}>📞 Phone</button>
        </div>

        <div className="main">

          <div className="controls">

            <label>
              {type === "url" && "Enter URL"}
              {type === "text" && "Enter Text"}
              {type === "email" && "Enter Email"}
              {type === "phone" && "Enter Phone Number"}
            </label>

            <input
              type="text"
              placeholder="Enter here..."
              value={text}
              onChange={(e) => handleInput(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <label>QR Code Color</label>

            <input
              type="color"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
            />

            <button onClick={clearAll}>
              Clear
            </button>

          </div>

          <div className="preview">

            <h2>Preview</h2>

            {text && !error ? (
              <>
                <div ref={qrRef}>
                  <QRCode
                    value={getQRValue()}
                    size={220}
                    fgColor={qrColor}
                  />
                </div>

                <button onClick={downloadQR}>
                  📥 Download QR
                </button>
              </>
            ) : (
              <p>
                {error || "Enter something to generate QR"}
              </p>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
