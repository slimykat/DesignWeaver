import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EvalImageSection from "./EvalImageSection";
import EvalSelectedSection from "./EvalSelectedSection";
import { Button } from "antd";
import { getUserData } from "../api/firebase";

import "../styles/Evaluation.css";

const Evaluation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedFinalImageId, setSelectedFinalImageId] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState([]);

  useEffect(() => {
    if (state != null) {
      getUserData(state.name).then((userData) => {
        if (userData.selectedFinalImageId) {
          setSelectedFinalImageId(userData.selectedFinalImageId);
        }
        if (userData.selectedImageId) {
          setSelectedImageId(userData.selectedImageId); 
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  const handleNextClick = () => {
    if (selectedFinalImageId.length >= 1) {
      if (selectedFinalImageId.length > 1) {
        alert("Please select at most 1 images.");
        return;
      } else {
        state.selectedFinalImageId = selectedFinalImageId;
        navigate("/PostExpSurvey", { state });
      }
    } else {
      alert("Please select at least one image.");
    }
  };

  return (
    <div className="evaluation">
      <div className="eval-image-section-title">
        <div className="eval-image-section-title-text">
          <p>
            Now choose 1 image from your favorites that best represent your
            ideal chair design for your client. Advance to the Next step after
            you make a selection.
          </p>
        </div>

        <div className="eval-Next-Button">
          <Button
            className="floating-button"
            type="primary"
            onClick={handleNextClick}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="evaluation-container">
        <EvalSelectedSection selectedFinalImageId={selectedFinalImageId} />
        <EvalImageSection
          selectedImageId={selectedImageId}
          selectedFinalImageId={selectedFinalImageId}
          setSelectedFinalImageId={setSelectedFinalImageId}
        />
      </div>
    </div>
  );
};

export default Evaluation;
