import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Space, message } from "antd";
import { writeDatabase, readDatabase } from "./api/firebase.js";
import "./styles/LoginForm.css";

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 20 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

const Start = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const checkUserExistence = async (name) => {
    try {
      const data = await readDatabase("participants/" + name);
      if (data == "") {
        message.error("User ID does not exist");
        return { exists: false };
      } else {
        message.success("User ID found");
        return { exists: true, data: data };
      }
    } catch (error) {
      message.error("Error happend when reading database");
      console.log("Error happend when reading database", error);
      return { exists: false };
    }
  };

  const onFinish = async (values) => {
    for (const key in values) {
      if (values[key] === undefined) {
        values[key] = "";
      }
    }

    let { exists, data } = await checkUserExistence(values.name);
    if (!exists) {
      return;
    }
    if (
      data.startTime == undefined ||
      data.startTime == null ||
      data.startTime == ""
    ) {
      // no startTime recorded, indicating a new user
      data.name = values.name;
      data.startTime = new Date().getTime();
      data.images = [];
      // data.group = values.group; // change: assign group in the db manually
      await writeDatabase("participants/" + values.name, data);
    } else if (data.startTime + 1000 * 60 * 60 < new Date().getTime()) {
      alert(
        "The experiment has already ended. Thank you for your participation."
      );
      return;
    }
    if (
      data.startTime == undefined ||
      data.startTime == null ||
      data.startTime == ""
    ) {
      // no startTime recorded, indicating a new user
      data.name = values.name;
      data.startTime = new Date().getTime();
      data.images = [];
      // data.group = values.group;
      await writeDatabase("participants/" + values.name, data);
    } else if (data.startTime + 1000 * 60 * 60 < new Date().getTime()) {
      alert(
        "The experiment has already ended. Thank you for your participation."
      );
      return;
    }
    navigate("/DesignRequirement", { state: data });
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div className="LoginForm">
      <div className="LoginForm-Title">
        <h1>StyleGuide</h1>
        <p>
          {" "}
          Join this{" "}
          <a
            href="https://ucsd.zoom.us/my/siruitao"
            target="_blank"
            rel="noreferrer"
          >
            Zoom link
          </a>{" "}
          and we will enabled audio and turn on screen recording to show your
          current browser window. We will record this to the cloud.
        </p>
        <p>
          Please enter your Participant ID to start the experiment. If you are
          logging back into an existing experiment, your previous data will be
          loaded.
        </p>
      </div>
      <div className="LoginForm-Wrapper">
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Participant ID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item name="group" label="Group" rules={[{ required: true }]}>
            <Select placeholder="Select a group" allowClear>
              <Option value="C">A</Option>
              <Option value="A">B</Option>
            </Select>
          </Form.Item> */}
          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Start;
