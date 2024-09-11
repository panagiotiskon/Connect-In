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
    onFileUpload(null); // Notify parent component that photo is removed
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


// const PhotoUpload = ({ onFileUpload }) => {

//   const [previewUrl, setPreviewUrl] = useState(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files ? event.target.files[0] : null;
//     onFileUpload(file); // Trigger the parent's handler with the selected file

//     if (file) {
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);

//       // Clean up the URL object when the component unmounts
//       return () => URL.revokeObjectURL(url);
//     } else {
//       setPreviewUrl(null);
//     }
//   };

//   return (
//     <div className="photo-upload">
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         className="form-control"
//       />
//       {previewUrl && (
//         <div className="preview">
//           <img src={previewUrl} alt="Preview" className="img-thumbnail mt-2" />
//         </div>
//       )}
//     </div>
//   );
// };

// PhotoUpload.propTypes = {
//   onFileUpload: PropTypes.func.isRequired,
// };

// export default PhotoUpload;



// const PhotoUpload = ({ onFileUpload }) => {
//   const [popupOpen, setPopupOpen] = useState(false);
//   const [popupContent, setPopupContent] = useState("");
//   const [popupType, setPopupType] = useState("success");
  
//   const onDrop = useCallback(
//     async (acceptedFiles) => {
//       const file = acceptedFiles[0];

//       if (file && file.type.startsWith("image/")) {
//         try {
//           // Call AuthService to upload the photo
//           await AuthService.uploadPhoto(file);

//           // Show success popup
//           setPopupType("success");
//           setPopupContent("Photo uploaded successfully!");

//           // Notify parent about success
//           onFileUpload(file);
//         } catch (error) {
//           console.error("Upload failed:", error);

//           // Show error popup
//           setPopupType("error");
//           setPopupContent("Failed to upload the photo.");
//         }
//       } else {
//         // Show error popup for invalid file
//         setPopupType("error");
//         setPopupContent("The file selected is not an image.");
//       }

//       setPopupOpen(true);
//       setTimeout(() => setPopupOpen(false), 2000);
//     },
//     [onFileUpload]
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: "image/*",
//     multiple: false,
//   });

//   return (
//     <>
//       <div
//         {...getRootProps()}
//         style={{
//           border: "2px dashed #007bff",
//           padding: "20px",
//           textAlign: "center",
//           cursor: "pointer",
//           marginBottom: "50px",
//           borderRadius: "10px",
//           backgroundColor: isDragActive ? "#f0f8ff" : "#f9f9f9",
//           transition: "background-color 0.2s ease",
//           width: "250px",
//           height: "150px",
//         }}
//       >
//         <input {...getInputProps()} />
//         <MDBIcon
//           fas
//           icon="image"
//           size="2x"
//           style={{ color: isDragActive ? "#007bff" : "#6c757d" }}
//         />
//         <p style={{ marginTop: "10px", color: "#6c757d", fontSize: "14px" }}>
//           {isDragActive
//             ? "Drop the photo here..."
//             : "Drag & drop or click to select a photo for your profile"}
//         </p>
//       </div>

//       <Popup
//         open={popupOpen}
//         onClose={() => setPopupOpen(false)}
//         position="bottom right"
//         closeOnDocumentClick
//         contentStyle={{
//           padding: "20px",
//           background: popupType === "success" ? "#d4edda" : "#f8d7da",
//           borderRadius: "8px",
//           textAlign: "center",
//           position: "absolute",
//           top: "20px",
//           right: "20px",
//           border: "none",
//           boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//         }}
//       >
//         <div>
//           <MDBIcon
//             fas
//             icon={popupType === "success" ? "check-circle" : "times-circle"}
//             size="2x"
//             className={popupType === "success" ? "text-success" : "text-danger"}
//           />
//           <p style={{ fontSize: "16px", margin: "10px 0" }}>{popupContent}</p>
//         </div>
//       </Popup>
//     </>
//   );
// };

// export default PhotoUpload;
