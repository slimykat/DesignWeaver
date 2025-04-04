import React, { useEffect, useState } from "react";
import { message, Image } from "antd";

// import { useLocation } from "react-router-dom";
import "../styles/image-section.css";

// import loading_img from "../img/Loading_icon.gif";
const loading_img =
  "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
// import imageNotFound from "../img/image-not-found-icon.png";

import { HeartTwoTone, InfoCircleTwoTone } from "@ant-design/icons";

import {
  get_all_images_id,
  load_image_fromIndex,
  get_image_attributes,
  setUserData,
} from "../api/firebase";

const ImagePoolPanel = ({
  inspectingImage,
  setInspectingImage,
  attributes,
  setAttributes,
  selectedImageId,
  setSelectedImageId,
  showOnlyLiked,
  setShowOnlyLiked,
}) => {
  const [images, setImages] = useState([]);

  // load every image url from the image pool when first render
  useEffect(() => {
    console.log("initializing image pool for user", attributes.userID);
    console.log("Current attributes: ", attributes);
    let image_ids = get_all_images_id(attributes.userID);

    let init_images = [];
    // let init_images_attributes = [];
    const f = async () => {
      for (let i = 0; i < image_ids.length; i++) {
        await get_image_attributes(image_ids[i], attributes.userID).then(
          (attri) => {
            init_images.push({ id: i, src: attri["url"], alt: "Image " + i });
          }
        );
      }
    };

    f().then(() => {
      setImages(init_images);
      setAttributes((attributes) => ({
        ...attributes,
        // images: init_images_attributes,
        N_img: image_ids.length,
        N_iteration: Math.floor(image_ids.length / 3), // Could change if we want to do iterations that are not 1:1 with images generated
      }));
    });
    // eslint-disable-next-line
  }, []);

  // load the image from the image pool when the image id is updated
  useEffect(() => {
    if (attributes.ack_id !== undefined) {
      console.log("load url get", attributes.ack_id);
      const index = attributes.ack_id[0];
      const url = attributes.ack_id[1];
      setImages((images) => [
        ...images.slice(0, index),
        { id: index, src: url, alt: "Image " + index },
        ...images.slice(index + 1, images.length),
      ]);
    }
    // eslint-disable-next-line
  }, [attributes.ack_id]);

  /// Add new image blocks with a 'loading...' gif to wait for new image generation
  // let new_images = ;
  useEffect(() => {
    if (attributes.new_images !== undefined) {
      const new_images = attributes.new_images;
      console.log("New images ", new_images);
      setImages((images) => [
        ...images,
        { id: new_images[0], src: loading_img, alt: "Image " + new_images[0] },
        { id: new_images[1], src: loading_img, alt: "Image " + new_images[1] },
        { id: new_images[2], src: loading_img, alt: "Image " + new_images[2] },
      ]);
    }
    setAttributes((attributes) => ({
      ...attributes,
      new_images: undefined,
    }));
    // eslint-disable-next-line
  }, [attributes.new_images]);

  const handleImageClick = async (id) => {
    if (selectedImageId.includes(id)) {
      console.log("Image clicked: ", id);
      const new_selectedImageId = selectedImageId.filter(
        (selectedImageId) => selectedImageId !== id
      );
      setSelectedImageId(new_selectedImageId);
      await setUserData(
        attributes.userID,
        "selectedImageId",
        new_selectedImageId
      );
    } else {
      console.log("Image clicked: ", id);
      const new_selectedImageId = [...selectedImageId, id];
      setSelectedImageId(new_selectedImageId);
      await setUserData(
        attributes.userID,
        "selectedImageId",
        new_selectedImageId
      );
    }
  };

  const handleInfoClick = (idx) => {
    console.log("Info clicked: ", idx);
    if (inspectingImage === idx) {
      setInspectingImage(null);
      setAttributes((attributes) => ({
        ...attributes,
        relatedTags: [],
        potentialTags: [],
      }));
    } else {
      load_image_fromIndex(idx, attributes.userID).then((ImageAttributes) => {
        console.log("Image Attributes: ", ImageAttributes);
        if (!ImageAttributes.extractedTags) {
          message.warning("Image is still processing, please try again later.");
        }
        setAttributes((attributes) => ({
          ...attributes,
          relatedTags:
            ImageAttributes.sourceTags == undefined
              ? ImageAttributes.tags
              : ImageAttributes.sourceTags,
          potentialTags: ImageAttributes.extractedTags,
        }));
        // if the image url is changed, update the inspecting image
        if (images[idx].src !== ImageAttributes.url) {
          setImages((images) => [
            ...images.slice(0, idx),
            { id: idx, src: ImageAttributes.url, alt: "Image " + idx },
            ...images.slice(idx + 1, images.length),
          ]);
        }
      });
      setInspectingImage(idx);
    }
    console.log("Attributes: ", attributes);
  };
  return (
    <div className="image-pool-panel-wraper">
      <div id="scrollableDiv" className="image-pool-panel">
        <Image.PreviewGroup>
          {images.toReversed().map(
            (image) =>
              (!showOnlyLiked || selectedImageId.includes(image.id)) && (
                <div key={image.id}>
                  <div className="thumbnail">
                    <div
                      className="checkbox"
                      onClick={() => handleImageClick(image.id)}
                    >
                      {selectedImageId.includes(image.id) ? (
                        <HeartTwoTone twoToneColor="#eb2f96" />
                      ) : (
                        <HeartTwoTone twoToneColor="LightGrey" />
                      )}
                    </div>
                    <div className="imageContainer">
                      <Image width={"100%"} src={image.src} />
                    </div>
                    {attributes.group !== "A" && (
                      <div
                        className="infobox"
                        onClick={() => handleInfoClick(image.id)}
                        // onMouseEnter={() => handleInfoHover(image.id)}
                        // onMouseLeave={() => handleInfoHoverOut(image.id)}
                      >
                        {image.id === inspectingImage ? (
                          <InfoCircleTwoTone twoToneColor="Orange" />
                        ) : (
                          <InfoCircleTwoTone twoToneColor="LightGrey" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
          )}
        </Image.PreviewGroup>
      </div>
    </div>
  );
};

export default ImagePoolPanel;
