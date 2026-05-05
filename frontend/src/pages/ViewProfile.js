import React from "react";
import { useParams } from "react-router-dom";
import ViewProfileComponent from "../components/ViewProfileComponent/ViewProfileComponent";

const ViewProfile = () => {
  const { userId } = useParams(); // Get userId from URL

  return (
    <div className="page-layout">
      <ViewProfileComponent userId={userId} />
    </div>
  );
};

export default ViewProfile;
