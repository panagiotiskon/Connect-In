import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Popup from "reactjs-popup";
import { MDBIcon } from "mdb-react-ui-kit";
import "reactjs-popup/dist/index.css";

const PhotoUpload = ({ onFileUpload }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupType, setPopupType] = useState("success"); // Use 'success' or 'error'

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file && file.type.startsWith("image/")) {
        onFileUpload(file);

        // Show success popup
        setPopupType("success");
        setPopupContent("Photo uploaded successfully!");
      } else {
        // Show error popup
        setPopupType("error");
        setPopupContent("The file selected is not an image.");
      }

      setPopupOpen(true);
      setTimeout(() => setPopupOpen(false), 2000);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  return (
    <>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #007bff",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: "50px",
          borderRadius: "10px",
          backgroundColor: isDragActive ? "#f0f8ff" : "#f9f9f9",
          transition: "background-color 0.2s ease",
          width: "250px",
          height: "150px",
        }}
      >
        <input {...getInputProps()} />
        <MDBIcon
          fas
          icon="image"
          size="2x"
          style={{ color: isDragActive ? "#007bff" : "#6c757d" }}
        />
        <p style={{ marginTop: "10px", color: "#6c757d", fontSize: "14px" }}>
          {isDragActive
            ? "Drop the photo here..."
            : "Drag & drop or click to select a photo for your profile"}
        </p>
      </div>

      <Popup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        position="bottom right"
        closeOnDocumentClick
        contentStyle={{
          padding: "20px",
          background: popupType === "success" ? "#d4edda" : "#f8d7da",
          borderRadius: "8px",
          textAlign: "center",
          position: "absolute",
          top: "20px",
          right: "20px",
          border: "none",
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
