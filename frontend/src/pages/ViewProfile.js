import React from "react";
import { useParams } from "react-router-dom";
import ViewProfileComponent from "../components/ViewProfileComponent";

const ViewProfile = () => {
  const { userId } = useParams(); // Get userId from URL

  return (
    <div style={{ backgroundColor: "#f3f2ef", minHeight: "100vh" }}>
      <ViewProfileComponent userId={userId} />
    </div>
  );
};

export default ViewProfile;
