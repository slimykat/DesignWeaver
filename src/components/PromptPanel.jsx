import React, { useEffect, useState } from "react";
import { Input, message } from "antd";
import { imageGenerate } from "../api/openai";
import { SendOutlined } from "@ant-design/icons";
import {
  StoreImageURL,
  tempUrlToStorage,
  getUserData,
  setUserData,
} from "../api/firebase";
import "../styles/param-section.css";
import { convertImageToTags } from "../api/openai";

const using_model = 3;

const images_per_iteration = 3;

const PromptPanel = ({
  inspectingImage,
  setInspectingImage,
  attributes,
  setAttributes,
  categories,
  loading,
  setLoading,
}) => {
  // let {state} = useLocation();
  const { TextArea } = Input;
  const [textValue, setTextValue] = useState("A dining chair ..."); // Step 1: Initialize state with default value

  // const [promptText, setPromptText] = useState('');

  useEffect(() => {
    if (attributes.prompt != "") {
      setTextValue(attributes.prompt);
      console.log("PromptPanel updated");
    } else {
      setTextValue("A dining chair ...");
    }
  }, [attributes.prompt]);

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
    // console.log(textValue);
  };
  const storeTags = () => {
    // extract tags from each categories and filter out the ones with scale 0
    let tags = [];
    categories.forEach((category) => {
      category.options.forEach((option) => {
        if (option.scale != 0) {
          tags.push([category.name, option.optionName, option.scale]);
        }
      });
    });
    console.log("tags: ", tags);
    return tags;
  };
  const handleClick = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (inspectingImage != null) {
      setInspectingImage(null);
      setAttributes((attributes) => ({
        ...attributes,
        relatedTags: [],
        potentialTags: [],
      }));
    }
    // store the current parameters state to the database
    await setUserData(attributes.userID, "categories", categories);

    console.log("Generating images with prompt: ", textValue);
    message.loading({
      content: "Generating image...",
      duration: 0,
      key: "imageGenPipeline",
    });
    let temp_new_images = [
      attributes.N_img,
      attributes.N_img + 1,
      attributes.N_img + 2,
    ];
    const batch_num = attributes.N_img;
    setAttributes((attributes) => ({
      ...attributes,
      N_img: attributes.N_img + 3,
      new_images: temp_new_images,
      N_iteration: attributes.N_iteration + 1,
    })); // update image blocks
    let full_prompt =
      "Create a product rendering of a dining room chair that stands out prominently against a white background. " +
      textValue;

    //// TODO: error handling
    const callBackForEachImg = async (res, index) => {
      // callback function after each image is generated
      console.log(index, "CALLBACK - images generated: ", res);
      // first acknowledge the image url
      setAttributes((attributes) => ({
        ...attributes,
        ack_id: [index + batch_num, res],
      })); // acknowledge image stored
      message.loading({
        content: `Image ${index + batch_num} processing`,
        duration: 0,
        key: `imageGenPipeline${index + batch_num}`,
      });
      const Promises = [];
      Promises.push(tempUrlToStorage(res)); // store the image url to firebase storage
      if (attributes.group == "C") {
        // perform extraction when group is C
        Promises.push(convertImageToTags(res, categories)); // perform image extraction to get recommended new tags
      }
      const response = await Promise.all(Promises);
      // console.log(response);
      let trueUrl = response[0];
      if (trueUrl == "") {
        message.error({
          content: `Image ${index + batch_num} failed`,
          duration: 0.5,
          key: `imageGenPipeline${index + batch_num}`,
        });
        trueUrl = res;
      }
      const extractedTags = response.length > 1 ? response[1] : "NA";
      const D = {
        url: trueUrl,
        prompt: textValue,
        model: using_model,
        userID: attributes.userID,
        N_iteration: attributes.N_iteration,
        sourceTags: storeTags(),
        extractedTags: extractedTags,
        timeStamp: new Date().getTime(),
      };

      await StoreImageURL(index + batch_num, D, attributes.userID).then(() =>
        message.success({
          content: `Image ${index + batch_num} done`,
          duration: 0.5,
          key: `imageGenPipeline${index + batch_num}`,
        })
      );
    };

    await imageGenerate(
      full_prompt,
      images_per_iteration,
      "1024x1024",
      "hd", //standard
      callBackForEachImg
    ).then(() => {
      message.success({
        content: `Complete!`,
        duration: 0.5,
        key: `imageGenPipeline`,
      });
    });
    setLoading(false);
  };

  return (
    <div className="prompt-panel">
      <div className="prompt-panel-input-container">
        <TextArea
          autoSize={{ minRows: 3 }}
          value={textValue}
          placeholder="Type a prompt to describe the dining chair you want to generate..."
          allowClear
          onChange={handleTextChange}
          style={{
            height: "100%",
            resize: "none",
          }}
        />
        <button id="generate-image-button" onClick={handleClick}>
          <SendOutlined />
        </button>
      </div>
    </div>
  );
};

export default PromptPanel;
