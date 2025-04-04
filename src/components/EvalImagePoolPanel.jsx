import React, { useEffect, useState } from "react";
import { message, Image } from "antd";
import { useLocation } from "react-router-dom";

import "../styles/Evaluation.css";

// import loading_img from "../img/Loading_icon.gif";
const loading_img =
  "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
// import imageNotFound from "../img/image-not-found-icon.png";

import {
  HeartTwoTone,
  CheckSquareTwoTone,
  BorderOutlined,
} from "@ant-design/icons";

import {
  get_all_images_id,
  get_image_attributes,
  setUserData,
} from "../api/firebase";

const EvalImagePoolPanel = ({
  selectedImageId,
  selectedFinalImageId,
  setSelectedFinalImageId,
  showOnlyLiked,
  setShowOnlyLiked,
}) => {
  const [images, setImages] = useState([]);
  const { state } = useLocation();
  console.log("selectedImageId out", selectedImageId);
  // load every image url from the image pool
  useEffect(() => {
    console.log("initializing image pool for user", state.name);
    let image_ids = get_all_images_id(state.name);
    console.log("image_ids", image_ids);
    let init_images = [];
    // let init_images_attributes = [];
    console.log("selectedImageId in", selectedImageId);
    const f = async () => {
      for (let i = 0; i < image_ids.length; i++) {
        await get_image_attributes(image_ids[i], state.name).then((attri) => {
          init_images.push({ id: i, src: attri["url"], alt: "Image " + i });
        });
      }
    };

    // load only images with selectedImageId using their image url from the image pool
    // const f = async () => {
    //   for (let i = 0; i < image_ids.length; i++) {
    //     await get_image_attributes(image_ids[i], state.name).then((attri) => {
    //       if (selectedImageId.includes(i)) {
    //         init_images.push({ id: i, src: attri["url"], alt: "Image " + i });
    //       }
    //     });
    //   }
    // };
    console.log("init_images", init_images);

    f().then(() => {
      setImages(init_images);
    });
    // eslint-disable-next-line
  }, []);

  const handleCheckboxClick = async (id) => {
    if (selectedFinalImageId.includes(id)) {
      // console.log("Image clicked: ", id);
      const new_selectedFinalImageId = selectedFinalImageId.filter(
        (selectedFinalImageId) => selectedFinalImageId !== id
      );
      setSelectedFinalImageId(new_selectedFinalImageId);
      await setUserData(
        state.name,
        "selectedFinalImageId",
        new_selectedFinalImageId
      );
    } else {
      console.log("Image clicked: ", id);
      if (selectedFinalImageId.length >= 1) {
        alert("Please select at most 1 image.");
        return;
      } else {
        const new_selectedFinalImageId = [...selectedFinalImageId, id];
        setSelectedFinalImageId(new_selectedFinalImageId);
        await setUserData(
          state.name,
          "selectedFinalImageId",
          new_selectedFinalImageId
        );
      }
    }
  };
  console.log("selectedFinalImageId", selectedFinalImageId);
  return (
    <div className="eval-image-pool-panel-wraper">
      <div id="scrollableDiv" className="eval-image-pool-panel">
        <Image.PreviewGroup>
          {images.toReversed().map(
            (image) =>
              (!showOnlyLiked || selectedImageId.includes(image.id)) && (
                <div key={image.id}>
                  <div className="eval-thumbnail">
                    <div className="eval-heart-icon">
                      {/* // No onClick for heart icon, just visual status */}
                      <HeartTwoTone
                        twoToneColor={
                          selectedImageId.includes(image.id)
                            ? "#eb2f96"
                            : "lightgrey"
                        }
                      />
                    </div>
                    <div className="eval-imageContainer">
                      <Image width={"100%"} src={image.src} />
                    </div>
                    <div
                      className="eval-checkbox"
                      onClick={() => handleCheckboxClick(image.id)}
                    >
                      {selectedFinalImageId.includes(image.id) ? (
                        <CheckSquareTwoTone twoToneColor={"gray"} />
                      ) : (
                        <BorderOutlined />
                      )}
                    </div>
                    <div className="eval-imageContainer">
                      <Image width={"100%"} src={image.src} />
                    </div>
                  </div>
                </div>
              )
          )}
        </Image.PreviewGroup>
      </div>
    </div>
  );
};

export default EvalImagePoolPanel;
