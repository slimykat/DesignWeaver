import React, { useState, useEffect } from "react";
import "../styles/Evaluation.css";
import { Image } from "antd";
import { load_image_fromIndex } from "../api/firebase";
import { useLocation } from "react-router-dom";

const EvalSelectedSection = ({
  selectedFinalImageId,
}) => {
  const { state } = useLocation();
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const urls = await Promise.all(
          selectedFinalImageId.map(async (imageId) => {
            const image = await load_image_fromIndex(imageId, state.name);
            return image.url;
          })
        );
        setImageUrls(urls);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, [selectedFinalImageId, state.name]);

  return (
    <div className="eval-selected-section">
      <div className="eval-selected-images-list">
        {imageUrls.map((url, index) => (
          <div key={index}>
            <Image
              width={"auto"}
              src={url}
              alt={`Selected Image ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvalSelectedSection;
