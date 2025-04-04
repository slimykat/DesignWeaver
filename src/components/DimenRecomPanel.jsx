import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Tag, Spin, Input } from "antd";
import { getRecommendedDimensions } from "../api/openai";
import { PlusOutlined } from "@ant-design/icons";
import "../styles/param-section.css";

const DimenRecomPanel = ({ categories, setCategories }) => {
  const [isDimenRecomPanelVisible, setIsDimenRecomPanelVisible] =
    useState(false);
  const [recommendedDimensions, setRecommendedDimensions] = useState([]);
  const [selectedDimensions, setSelectedDimensions] = useState([]); // Use state instead of ref
  const [loading, setLoading] = useState(false);

  // for custom dimension input
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const showInput = () => {
    setInputVisible(true);
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleInputConfirm = () => {
    if (inputValue && recommendedDimensions.indexOf(inputValue) === -1) {
      setRecommendedDimensions([...recommendedDimensions, inputValue]);
      setSelectedDimensions([...selectedDimensions, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDimensionAddClick = async () => {
    setSelectedDimensions([]); // Clear selected dimensions
    setRecommendedDimensions([]); // Clear recommended dimensions
    setLoading(true);
    setIsDimenRecomPanelVisible(true);
    const dimensions = await getRecommendedDimensions(categories);
    setRecommendedDimensions(dimensions);
    setLoading(false);
  };

  const handleSelect = (dimension) => {
    setSelectedDimensions((prevSelected) => {
      if (prevSelected.includes(dimension)) {
        return prevSelected.filter((dim) => dim !== dimension);
      } else {
        return [...prevSelected, dimension];
      }
    });
  };

  const handleAddRecommendedDimensions = (newDimensions) => {
    setCategories((prevCategories) => [
      ...prevCategories,
      ...newDimensions.map((dimension, index) => ({
        key: (prevCategories.length + index).toString(),
        name: dimension,
        isFuture: false,
        options: [],
      })),
    ]);
  };

  const handleAddDimensions = () => {
    handleAddRecommendedDimensions(selectedDimensions);
    setIsDimenRecomPanelVisible(false);
    setSelectedDimensions([]); // Clear selected dimensions after adding
  };

  return (
    <>
      <Button
        className="add-dimension-button"
        type="primary"
        icon={<PlusOutlined />}
        style={{ backgroundColor: "white", color: "black" }}
        onClick={handleDimensionAddClick}
      >
        Add New Dimensions
      </Button>
      <Modal
        title="Add New Design Dimensions"
        open={isDimenRecomPanelVisible}
        onOk={handleAddDimensions}
        onCancel={() => setIsDimenRecomPanelVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsDimenRecomPanelVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddDimensions}>
            Ok
          </Button>,
        ]}
      >
        <div className="modal-content">
          {loading ? (
            <Spin size="large" />
          ) : (
            <div
              className="recommend-input"
              style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
            >
              {recommendedDimensions.map((dimension) => (
                <Tag
                  key={dimension}
                  color={
                    selectedDimensions.includes(dimension) ? "blue" : "default"
                  }
                  onClick={() => handleSelect(dimension)}
                  style={{
                    cursor: "pointer",
                    padding: "5px 10px",
                    borderRadius: "20px",
                  }}
                >
                  {dimension}
                </Tag>
              ))}
              {inputVisible ? (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  style={{ width: 80 }}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              ) : (
                <Tag
                  onClick={showInput}
                  style={{
                    backgroundColor: "Lightgrey",
                    borderStyle: "dashed",
                    color: "white",
                    cursor: "pointer",
                    padding: "5px 10px",
                    borderRadius: "20px",
                  }}
                >
                  <PlusOutlined /> Custom
                </Tag>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DimenRecomPanel;
