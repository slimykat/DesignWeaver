import React, { useState, useEffect } from "react";
import { getUserData } from "../api/firebase";
import { useLocation } from "react-router-dom";
import { Image } from "antd";
import { load_image_fromIndex } from "../api/firebase";
import "../styles/post-exp-survey.css";

const PostExpSurvey = () => {
  const [selectedFinalImageId, setSelectedFinalImageId] = useState([]);
  const { state } = useLocation();
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (state != null) {
      getUserData(state.name).then((userData) => {
        if (userData.selectedFinalImageId) {
          setSelectedFinalImageId(userData.selectedFinalImageId);
        }
      });
    }
    // eslint-disable-next-line
  }, []);

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
    <div className="post-exp-survey-container">
      <div className="post-exp-survey-header">
        <div className="post-exp-survey-text">
          <p className="survey-message">
            Please complete the survey below. When the survey says &quot;Please
            elaborate a bit...&quot;, you can simply talk out loud and your
            verbal responses will be recorded through Zoom (preferred!), or you
            may type your responses.
          </p>
        </div>
        <div className="post-exp-survey-images">
          {imageUrls.map((url, index) => (
            <div key={index} className="image-container">
              <Image
                height={"100%"}
                width={"100%"}
                src={url}
                alt={`Image ${index + 1}`}
              />
              <h4>Image {index + 1}</h4>
            </div>
          ))}
        </div>
      </div>
      <iframe
        src="https://ucsd.co1.qualtrics.com/jfe/form/SV_aWAoUJYKlEVJwXQ"
        title="Qualtrics Survey"
        className="post-exp-survey-iframe"
      ></iframe>
    </div>
  );
};

export default PostExpSurvey;
