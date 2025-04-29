import React from "react";
import "../styles/Evaluation.css";
import EvalImagePoolPanel from "./EvalImagePoolPanel";
import { HeartTwoTone } from "@ant-design/icons";

const EvalImageSection = ({
  selectedImageId,
  selectedFinalImageId,
  setSelectedFinalImageId,
}) => {
  const showOnlyLiked = true; // Set showOnlyLiked to true

  return (
    <div className="eval-image-section">
      <div className="eval-Tab-button-wrapper">
        <button className="eval-LikeTab-button" disabled>
          <HeartTwoTone twoToneColor="#eb2f96" />
          {selectedImageId.length > 0 && (
            <span className="eval-like-counter">{selectedImageId.length}</span>
          )}
        </button>
      </div>

      <EvalImagePoolPanel
        selectedImageId={selectedImageId}
        selectedFinalImageId={selectedFinalImageId}
        setSelectedFinalImageId={setSelectedFinalImageId}
        showOnlyLiked={showOnlyLiked} // Always true
      ></EvalImagePoolPanel>
    </div>
  );
};

export default EvalImageSection;
