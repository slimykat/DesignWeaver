import React, { useState } from "react";
import "../styles/image-section.css";
import ImagePoolPanel from "./ImagePoolPanel";
import { HeartTwoTone } from "@ant-design/icons";

const ImageSection = ({
  inspectingImage,
  setInspectingImage,
  attributes,
  setAttributes,
  selectedImageId,
  setSelectedImageId,
}) => {
  const [showOnlyLiked, setShowOnlyLiked] = useState(false);

  return (
    <div className="image-section">
      <div className="image-section-title" style={{ color: "black" }}>
        <div className="image-section-title-text">Image Gallery</div>
        <div className="like-tab-wrapper">
          <button
            className="LikeTab-button"
            onClick={() => {
              console.log("Liked Images: ", selectedImageId);
              setShowOnlyLiked(!showOnlyLiked);
            }}
          >
            {showOnlyLiked ? (
              <HeartTwoTone twoToneColor="#eb2f96" />
            ) : (
              <HeartTwoTone twoToneColor="LightGrey" />
            )}
            {selectedImageId.length > 0 && (
              <span className="like-counter">{selectedImageId.length}</span>
            )}
          </button>
        </div>
      </div>

      <ImagePoolPanel
        inspectingImage={inspectingImage}
        setInspectingImage={setInspectingImage}
        attributes={attributes}
        setAttributes={setAttributes}
        selectedImageId={selectedImageId}
        setSelectedImageId={setSelectedImageId}
        showOnlyLiked={showOnlyLiked}
        setShowOnlyLiked={setShowOnlyLiked}
      ></ImagePoolPanel>
    </div>
  );
};

export default ImageSection;
