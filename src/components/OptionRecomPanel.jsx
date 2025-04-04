import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import { Modal, Button, Tag, Spin, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getRecommendedOptions } from "../api/openai";
import "../styles/param-section.css";

const OptionRecomPanel = forwardRef((props, ref) => {
  const { categories, setCategories } = props;
  const [isOptionRecomPanelVisible, setIsOptionRecomPanelVisible] =
    useState(false);
  const [recommendedOptions, setRecommendedOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]); // Use state instead of ref
  const selectedCategoryKey = useRef(null);
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
    if (inputValue && recommendedOptions.indexOf(inputValue) === -1) {
      setRecommendedOptions([...recommendedOptions, inputValue]);
      setSelectedOptions([...selectedOptions, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useImperativeHandle(ref, () => ({
    showOptionAddModal: handleOptionAddClick,
  }));

  const handleOptionAddClick = async (categoryKey) => {
    selectedCategoryKey.current = categoryKey;
    setSelectedOptions([]); // Clear selected options
    setRecommendedOptions([]); // Clear recommended options
    setLoading(true);
    setIsOptionRecomPanelVisible(true);
    const currentCategory = categories.find(
      (category) => category.key === categoryKey
    );
    const options = await getRecommendedOptions(currentCategory);
    setRecommendedOptions(options);
    setLoading(false);
  };

  const handleSelect = (option) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter((opt) => opt !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  const handleAddRecommendedOptions = (newOptions) => {
    setCategories((prevCategories) => {
      const updatedCategories = prevCategories.map((category) => {
        if (category.key === selectedCategoryKey.current) {
          return {
            ...category,
            options: [
              ...category.options,
              ...newOptions.map((option) => ({
                optionName: option,
                scale: 0,
                isFuture: false,
              })),
            ],
          };
        }
        return category;
      });
      return updatedCategories;
    });
  };

  const handleAddOptions = () => {
    handleAddRecommendedOptions(selectedOptions);
    setIsOptionRecomPanelVisible(false);
    setSelectedOptions([]); // Clear selected options after adding
  };

  const title_text = categories.find((category) => category.key === selectedCategoryKey.current)?.name
      ? "Add New Tags for: " + categories.find((category) => category.key === selectedCategoryKey.current)?.name
      : "Add New Tags";

  return (
    <Modal
      title={title_text}
      open={isOptionRecomPanelVisible}
      onOk={handleAddOptions}
      onCancel={() => setIsOptionRecomPanelVisible(false)}
      footer={[
        <Button key="back" onClick={() => setIsOptionRecomPanelVisible(false)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleAddOptions}>
          OK
        </Button>,
      ]}
    >
      <div className="modal-content">
        {loading ? (
          <Spin size="large" />
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {recommendedOptions.map((option) => (
              <Tag
                key={option}
                color={selectedOptions.includes(option) ? "blue" : "default"}
                onClick={() => handleSelect(option)}
                style={{
                  cursor: "pointer",
                  padding: "5px 10px",
                  borderRadius: "20px",
                }}
              >
                {option}
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
  );
});

OptionRecomPanel.displayName = "OptionRecomPanel";

export default OptionRecomPanel;
