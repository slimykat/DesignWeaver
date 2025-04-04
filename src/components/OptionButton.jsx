import React, { useEffect, useRef } from "react";
import "../styles/param-section.css";
// import ScalePanel from "./ScalePanel";
import { Button, message } from "antd";
import { convertTagsToPrompt } from "../api/openai"; // Import the function to convert tags to prompt

// import { Opacity } from "@mui/icons-material";

const OptionButton = ({
  attributes,
  setAttributes,
  categoryKey,
  option,
  categories,
  setCategories,
  relatedTagScale,
  isFuture,
}) => {
  const buttonRef = useRef(null);
  const messageKey = "promptUpdate";

  const categoryName = categories.find(
    (category) => category.key === categoryKey
  )?.name;

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
  const getColorCSS = (curScale, prevScale) => {
    if (isFuture) {
      return {
        color: "grey",
        backgroundColor: "#ffffa0",
        borderColor: "grey",
        borderWidth: "2.5px",
      };
    }
    let backgroundColor = null;
    let color = null;
    if (curScale) {
      // positive
      backgroundColor = "#355ff9";
      color = "white";
    } else {
      // neutral
      backgroundColor = "#ffffff";
      color = "black";
    }

    if (prevScale === undefined || prevScale === null) {
      // no image selected
      return {
        backgroundColor: backgroundColor,
        color: color,
      };
    } else {
      return {
        backgroundColor: backgroundColor,
        color: color,
        borderColor: "black",
        borderWidth: "2.5px",
        // backgroundImage: `linear-gradient(135deg, ${backgroundColor} 70%, ${backgroundColor2} 30%)`,
      };
    }
  };

  const handleClick = async () => {
    if (isFuture) {
      setCategories((categories) => {
        const newCategories = categories.map((category) =>
          category.key === categoryKey
            ? {
                ...category,
                isFuture: false,
                options: category.options.map((opt) =>
                  opt.optionName === option.optionName
                    ? { ...opt, isFuture: false }
                    : opt
                ),
              }
            : category
        );
        return newCategories;
      });
    } else {
      // update category options and then update prompt

      // if the option is already selected, then deselect it
      // if the option is not selected, then select it
      const newCategories = categories.map((category) =>
        category.key === categoryKey
          ? {
              ...category,
              options: category.options.map((opt) =>
                opt.optionName === option.optionName
                  ? { ...opt, scale: !option.scale }
                  : opt
              ),
            }
          : category
      );

      // update snapshotTags in attributes as the current categories
      setAttributes((attributes) => {
        const newAttributes = { ...attributes, snapshotTags: categories };
        return newAttributes;
      });
      setCategories(newCategories);
      await updatePrompt(newCategories); // Generate the prompt using the new updated tags
    }
  };

  return (
    <div style={{ position: "relative" }} ref={buttonRef}>
      {/* {showPopup && (
        <ScalePanel
        attributes={attributes}
          setAttributes={setAttributes}
          categoryKey={categoryKey}
          option={option}
          categories={categories}
          setCategories={setCategories}
          setOpenedPopup={setOpenedPopup}
          dimensionName={`${categoryName}: ${option.optionName}`}
        />
      )} */}
      <Button
        type={isFuture ? "dashed" : "primary"}
        size="middle"
        onClick={handleClick}
        style={getColorCSS(option.scale, relatedTagScale)}
        className={`option-button`}
        // className={`option-button ${showPopup ? "selected" : ""}`}
        // className={`option-button ${getColor(option.scale, relatedTagScale)} ${showPopup ? "selected" : ""}`}
      >
        {option.optionName}
      </Button>
      {/* <button
        className={`option-button ${getColor(option.scale)} ${showPopup ? "selected" : ""}`}
        onClick={handleClick}
      >
        {option.optionName}
      </button> */}
    </div>
  );
};

export default OptionButton;
