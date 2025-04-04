import React, { useEffect, useRef, useState } from "react";
import { Button, message, Modal } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { DragSortTable } from "@ant-design/pro-components";
import OptionButton from "./OptionButton";
import "../styles/param-section.css";
import PromptPanel from "./PromptPanel";
import OptionRecomPanel from "./OptionRecomPanel";
import DimenRecomPanel from "./DimenRecomPanel";

const ParamSection = ({
  inspectingImage,
  setInspectingImage,
  attributes,
  setAttributes,
  categories,
  setCategories,
  loading,
  setLoading,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const optionRecomPanelRef = useRef();

  useEffect(() => {
    //reset any future categories and options
    const trueCategories = categories.filter((category) => !category.isFuture);
    var tempCategories = trueCategories.map((category) => {
      category.options = category.options.filter((option) => !option.isFuture);
      return category;
    });

    if (attributes.potentialTags && attributes.potentialTags.length > 0) {
      attributes.potentialTags.forEach((future) => {
        const categoryIndex = tempCategories.findIndex(
          (category) => category.name === future.name
        );
        if (categoryIndex < 0) {
          tempCategories.push({
            key: tempCategories.length.toString(),
            name: future.name,
            isFuture: true,
            options: future.tags.map((tag) => {
              return {
                optionName: tag,
                scale: 0,
                isFuture: true,
              };
            }),
          });
        } else {
          future.tags.forEach((tag) => {
            if (
              !tempCategories[categoryIndex].options.find(
                (option) => option.optionName === tag
              )
            ) {
              tempCategories[categoryIndex].options.push({
                optionName: tag,
                scale: 0,
                isFuture: true,
              });
            }
          });
        }
      });
    }
    setCategories(tempCategories);
    // eslint-disable-next-line
  }, [attributes.potentialTags]);

  const handleDragSortEnd = (beforeIndex, afterIndex, newCategories) => {
    setCategories(newCategories);
    message.success("Categories reordered successfully");
  };

  const showDeleteConfirm = (key) => {
    setSelectedKey(key);
    setIsModalVisible(true);
  };

  const handleDelete = () => {
    const updatedCategories = categories.filter(
      (category) => category.key !== selectedKey
    );
    setCategories(updatedCategories);
    setIsModalVisible(false);
    setSelectedKey(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedKey(null);
  };

  const getRelation = (categoryName, optionName) => {
    if (!attributes.relatedTags || attributes.relatedTags === undefined) {
      return null;
    } else {
      const relation1 = attributes.relatedTags.filter(
        (tag) => tag[0] === categoryName && tag[1] === optionName
      );
      const relation2 = attributes.potentialTags.filter(
        (future) =>
          future.name === categoryName && future.tags.includes(optionName)
      );

      if (relation1.length === 0 && relation2.length === 0) {
        return null;
      }
      const relation = relation1.length > 0 ? relation1 : 1;
      return relation;
    }
  };

  const handleOptionAddClick = (categoryKey) => {
    if (optionRecomPanelRef.current) {
      optionRecomPanelRef.current.showOptionAddModal(categoryKey);
    }
  };

  const columns = [
    {
      title: "",
      dataIndex: "sort",
      width: 60,
      className: "drag-visible",
    },
    {
      title: "Dimensions",
      dataIndex: "name",
      render: (options, record) => (
        <div
          className={`drag-visible ${record.isFuture ? "futureCategory" : ""}`}
        >
          {record.name}
        </div>
      ),
    },
    {
      title: "Tags",
      dataIndex: "options",
      render: (options, record) => (
        <div className="options">
          {options.map((option) => (
            <OptionButton
              key={option.optionName}
              attributes={attributes}
              setAttributes={setAttributes}
              categoryKey={record.key}
              option={option}
              categories={categories}
              setCategories={setCategories}
              relatedTagScale={getRelation(record.name, option.optionName)}
              isFuture={option.isFuture}
            />
          ))}
        </div>
      ),
    },
    {
      title: " Add Tag",
      dataIndex: "addOption",
      render: (_, record) => (
        <Button
          type="default"
          shape="circle"
          icon={<PlusOutlined />}
          disabled={record.isFuture}
          onClick={() => handleOptionAddClick(record.key)}
        />
      ),
    },
    {
      title: "Delete",
      dataIndex: "deletes",
      render: (_, record) => (
        <Button
          type="default"
          shape="circle"
          icon={<DeleteOutlined />}
          disabled={record.isFuture}
          onClick={() => showDeleteConfirm(record.key)}
        />
      ),
    },
  ];

  return (
    <div className="param-section">
      <div className="param-section-title">
        Write prompts to generate product designs
      </div>

      <PromptPanel
        inspectingImage={inspectingImage}
        setInspectingImage={setInspectingImage}
        attributes={attributes}
        setAttributes={setAttributes}
        categories={categories}
        loading={loading}
        setLoading={setLoading}
      ></PromptPanel>
      <div className="param-section-description">
        Click on tags below to update your prompt above
      </div>
      <div className="param-section-table">
        <DragSortTable
          headerTitle="Drag Most Important Design Dimensions to the Top"
          columns={columns}
          rowKey="key"
          search={false}
          pagination={false}
          dataSource={categories}
          dragSortKey="sort"
          onDragSortEnd={handleDragSortEnd}
        />
        <OptionRecomPanel
          ref={optionRecomPanelRef}
          attributes={attributes}
          setAttributes={setAttributes}
          categories={categories}
          setCategories={setCategories}
        />
        <DimenRecomPanel
          attributes={attributes}
          setAttributes={setAttributes}
          categories={categories}
          setCategories={setCategories}
        />
      </div>

      <Modal
        title="Confirm Delete"
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>
          Are you sure you want to delete this dimension: &quot;
          {selectedKey == null ? "" : categories[selectedKey].name}&quot;?
        </p>
      </Modal>
    </div>
  );
};

export default ParamSection;
