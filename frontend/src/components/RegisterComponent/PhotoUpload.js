import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Popup from "reactjs-popup";
import { MDBIcon } from "mdb-react-ui-kit";
import "reactjs-popup/dist/index.css";


const PhotoUpload = ({ onFileUpload }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupType, setPopupType] = useState("success");

  const {} = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      handleFile(file);
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileUpload(file);
    setPopupOpen(true);
    setPopupContent("File uploaded successfully!");
    setPopupType("success");
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    onFileUpload(null);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    URL.revokeObjectURL(previewUrl);
  };

  return (
    <>
      <div className="photo-upload">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="form-control"
          style={{ display: "none" }}
          id="fileInput"
        />
        <label htmlFor="fileInput" className="btn btn-primary">
          Select Photo
        </label>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={handleRemovePhoto}
          disabled={!previewUrl}
        >
          Remove Photo
        </button>
      </div>

      {previewUrl && (
        <div className="photo-preview">
          <img src={previewUrl} alt="Preview" className="img-thumbnail mt-2" />
        </div>
      )}

      <Popup
        open={popupOpen}
        onClose={handlePopupClose}
        closeOnDocumentClick
        contentStyle={{
          left: 0,
          width: "100%",
          maxWidth: "500px",
          padding: "20px",
          background: popupType === "success" ? "#d4edda" : "#f8d7da",
          borderRadius: "8px",
          textAlign: "center",
          top: "30%",
          right: 0,
          border: "none",
          position: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <div>
          <MDBIcon
            fas
            icon={popupType === "success" ? "check-circle" : "times-circle"}
            size="2x"
            className={popupType === "success" ? "text-success" : "text-danger"}
          />
          <p style={{ fontSize: "16px", margin: "10px 0" }}>{popupContent}</p>
        </div>
      </Popup>
    </>
  );
};

export default PhotoUpload;

