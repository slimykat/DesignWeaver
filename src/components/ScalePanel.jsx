import React, { useState } from "react";
import { Modal } from "antd";
import "../styles/param-section.css";
import { convertTagsToPrompt } from "../api/openai"; // Import the function to convert tags to prompt
import { message, Switch } from "antd";

const ScalePanel = ({
  attributes,
  setAttributes,
  categoryKey,
  option,
  categories,
  setCategories,
  setOpenedPopup,
}) => {
  const [selectedScale, setSelectedScale] = useState(option.scale); // [0, 1]
  const [isModalVisible, setIsModalVisible] = useState(false);
  const messageKey = "promptUpdate";

  const updatePrompt = async (updatedCategories) => {
    message.loading({
      content: "Generating prompt...",
      duration: 0,
      key: messageKey,
    });
    try {
      const prompt = await convertTagsToPrompt(
        attributes.snapshotTags,
        updatedCategories,
        attributes.prompt
      );
      // Update the attributes state with the generated prompt
      setAttributes((attributes) => ({
        ...attributes,
        prompt,
      }));
      message.success({
        content: "Prompt Updated!",
        duration: 1.5,
        key: messageKey,
      });
    } catch (error) {
      message.error({
        content: "Error generating prompt. Please try again.",
        duration: 1.5,
        key: messageKey,
      });
      console.error("Error generating prompt: ", error);
    }
  };

  const handleUpdateClick = () => {
    let newScale = selectedScale;
    let optionName = option.optionName;
    if (newScale === option.scale) {
      console.log("No change detected");
      return;
    }

    // Create a new updated categories array
    let updatedCategories = categories.map((category) =>
      category.key === categoryKey
        ? {
            ...category,
            options: category.options.map((opt) =>
              opt.optionName === optionName ? { ...opt, scale: newScale } : opt
            ),
          }
        : category
    );

    // Set the updated categories state
    setCategories(updatedCategories);
    setOpenedPopup([-1, "NA"]); // Close the panel
    updatePrompt(updatedCategories); // Generate the prompt using the new updated tags
  };

  const showDeleteConfirm = () => {
    console.log("showDeleteConfirm called"); // Debug: Check if this function is called
    setIsModalVisible(true);
  };

  const handleDeleteClick = () => {
    console.log("handleDeleteClick called"); // Debug: Check if this function is called
    let optionName = option.optionName;
    console.log("Deleting option:", optionName); // Debug: Check which option is being deleted
    setCategories((categories) => {
      const newCategories = categories.map((category) =>
        category.key === categoryKey
          ? {
              ...category,
              options: category.options.filter(
                (option) => option.optionName !== optionName
              ),
            }
          : category
      );
      console.log("New categories:", newCategories); // Debug: Inspect the new categories array
      return newCategories;
    });
    setOpenedPopup([-1, "NA"]); // Close the panel
    setIsModalVisible(false); // Close the modal
  };

  const handleCancel = () => {
    console.log("handleCancel called"); // Debug: Check if this function is called
    setIsModalVisible(false);
  };

  const getColor = (scale) => {
    return scale ? "positive" : "neutral";
    // switch (scale) {
    //   case -1:
    //     return "negative";
    //   case 0:
    //     return "neutral";
    //   case 1:
    //     return "positive";
    //   default:
    //     return "neutral";
    // }
  };

  return (
    <div className="scale-panel-wrapper">
      <div className="scale-panel">
        <div className={`dimension-name-button ${getColor(selectedScale)}`}>
          {categories[categoryKey] != undefined
            ? categories[categoryKey].name
            : ""}
          : {option.optionName}
        </div>
        {/* <div className="scale-panel-title">Select scale:</div> */}
        <div className="scale-button-container">
          <Switch
            onChange={(checked) => {
              setSelectedScale(checked);
            }}
            checked={selectedScale}
          />
          <div className="scale-panel-description">
            {selectedScale
              ? "Put this in my prompt"
              : "Don't put this in my prompt"}
          </div>
        </div>
        {/* <div className="scale-panel-title">Specify Sub-category (optional)</div>
      <div className="scale-panel-description">
        Choose recommended keywords you like
      </div>
      <div className="scale-button-container">
        <button className="scale-button">Walnut</button>
        <button className="scale-button">Maple</button>
        <button className="scale-button">Birch</button>
        <button className="scale-button">White Ash</button>
        <button className="scale-button">Mahogany</button>
      </div> */}
        <Modal
          title="Confirm Delete"
          open={isModalVisible}
          onOk={handleDeleteClick}
          onCancel={handleCancel}
          okText="Yes"
          cancelText="No"
        >
          <p>Are you sure you want to delete this tag?</p>
        </Modal>
        <div className="button-container">
          <button id="delete-button" onClick={showDeleteConfirm}>
            Delete
          </button>
          <button id="update-button" onClick={handleUpdateClick}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScalePanel;
