import "./styles/App.css";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ImageSection from "./components/ImageSection"; // ChatGPT prompt panel and image pool
import ParamSection from "./components/ParamSection"; // Parameter display section
import { getUserData, setUserData } from "./api/firebase";
import { ConfigProvider, message, Statistic, Button } from "antd";
import {
  ClockCircleOutlined,
  OrderedListOutlined,
  BookOutlined,
  HeartOutlined,
  InfoCircleTwoTone,
  HeartTwoTone,
} from "@ant-design/icons";
const { Countdown } = Statistic;

import en_US from "antd/locale/en_US";

const initialCategories = [
  {
    key: "0",
    name: "Aesthetic",
    isFuture: false,
    options: [
      { optionName: "Minimalist", scale: false, isFuture: false },
      { optionName: "Neutral", scale: false, isFuture: false },
      { optionName: "Clean Lines", scale: false, isFuture: false },
    ],
  },
  {
    key: "1",
    name: "Sustainability",
    isFuture: false,
    options: [
      { optionName: "Eco-friendly", scale: false, isFuture: false },
      { optionName: "Durable", scale: false, isFuture: false },
    ],
  },
  {
    key: "2",
    name: "Functionality",
    isFuture: false,
    options: [
      { optionName: "Ergonomic", scale: false, isFuture: false },
      { optionName: "Lightweight", scale: false, isFuture: false },
      { optionName: "Sturdy", scale: false, isFuture: false },
      { optionName: "Scratch-resistant", scale: false, isFuture: false },
    ],
  },
];

function App() {
  let { state } = useLocation();
  const navigate = useNavigate();
  const [notFinished, setNotFinished] = useState(true);
  const [extraMinuteStarted, setExtraMinuteStarted] = useState(false);

  // For experiment purposes, we don't allow direct access to the app without a user ID
  if (state == null) {
    console.log("State is null, redirecting to start page.");
    navigate("/Start");
  }

  const targetTime = useRef(0); // 15 minutes from now
  const extraMinuteTime = useRef(0); // Extra 1 minute timer

  if (state != null && state.instructFinishTime !== undefined) {
    targetTime.current = state.instructFinishTime + 1000 * 60 * 15;
    extraMinuteTime.current = targetTime.current + 1000 * 60; // 1 minute after the 15 minutes
  }

  const [selectedImageId, setSelectedImageId] = useState([]); // State to hold the selection in the image pool
  const [categories, setCategories] = useState(initialCategories); // State to hold the categories data
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state != null) {
      getUserData(state.name).then((userData) => {
        if (userData.categories !== undefined) {
          setCategories(userData.categories);
        }
        if (userData.selectedImageId !== undefined) {
          setSelectedImageId(userData.selectedImageId);
        }
      });
    }

    const now = new Date().getTime();

    if (now > targetTime.current && notFinished) {
      message.warning({
        content:
          "You now have one minute left for the design stage. Finish generating and selecting images as your favorites. The screen will auto-advance in one minute.",
        duration: 0,
        key: "timeup",
      });
      setExtraMinuteStarted(true);
      setNotFinished(false); // Allow navigation after the 15-minute timer finishes
    }

    if (now > extraMinuteTime.current && extraMinuteStarted) {
      handleNextClick(); // Force navigation after the extra 1 minute
    }

    // eslint-disable-next-line
  }, [extraMinuteStarted]);

  const handleNextClick = () => {
    if (loading) {
      return;
    }
    // Sync user data with the server
    message.destroy("timeup");
    getUserData(state.name).then((userData) => {
      if (userData.taskFinishedTime !== undefined) {
        state.taskFinishedTime = userData.taskFinishedTime;
        state.selectedImageId = selectedImageId;
        navigate("/Evaluation", { state });
      } else {
        state.taskFinishedTime = new Date().getTime();
        state.selectedImageId = selectedImageId;
        setUserData(
          state.name,
          "taskFinishedTime",
          state.taskFinishedTime
        ).then(() => {
          navigate("/Evaluation", { state });
        });
      }
    });
  };

  const [inspectingImage, setInspectingImage] = useState(null);
  const [attributes, setAttributes] = useState({
    userID: state ? state.name : "TestUser",
    group: state ? state.group : "C",
    prompt: "", // Add prompt state to hold the generated prompt
    potentialTags: [],
    relatedTags: [],
    snapshotTags: [],
  });

  return (
    <ConfigProvider locale={en_US}>
      <div className="task-instruction-container">
        <div className="task-instruction-text">
          <p>
            Your goal now is to explore different design concepts for a chair to
            satisfy your client&apos;s needs. You have 15 minutes to create
            prompts that will generate images of chairs. Click the{" "}
            <b>
              <InfoCircleTwoTone twoToneColor="gray" /> icon
            </b>{" "}
            to see more dimensions on an image. Use the{" "}
            <b>
              <HeartTwoTone twoToneColor="#eb2f96" /> heart icon
            </b>{" "}
            to add images to your favorites. In the next stage, you will pick
            one chair for your client from your <b>favorites folder</b>. You can
            only advance to the Next step after 15 minutes. (
            <a href="/assets/Chair-Design-Requirement.pdf" target="_blank">
              <OrderedListOutlined />
              Design Requirements
            </a>{" "}
            |{" "}
            <a
              href="/assets/Tool_Instruction.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <BookOutlined />
              Tool Instructions
            </a>
            )
          </p>
        </div>
        <div className="Countdown-Wrapper">
          <div className="Countdown-Title">
            <ClockCircleOutlined style={{ color: "gray" }} />
          </div>
          <Countdown
            id="clock"
            format="mm:ss"
            value={
              extraMinuteStarted ? extraMinuteTime.current : targetTime.current
            }
            valueStyle={{ fontSize: "medium", color: "grey" }}
            onFinish={() => {
              if (!extraMinuteStarted) {
                message.warning({
                  content:
                    "You now have one minute left for the design stage. Finish generating and selecting images as your favorites. The screen will auto-advance in one minute.",
                  duration: 60,
                  key: "timeup",
                });
                setExtraMinuteStarted(true); // Start the extra 1 minute timer
                setNotFinished(false); // Allow the button to be clickable after 15 minutes
              } else {
                handleNextClick(); // Force navigation to the next page
              }
            }}
          />
          <Button
            className="floating-button"
            type="primary"
            disabled={loading || notFinished}
            onClick={handleNextClick}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="App">
        <ParamSection
          inspectingImage={inspectingImage}
          setInspectingImage={setInspectingImage}
          attributes={attributes}
          setAttributes={setAttributes}
          categories={categories}
          setCategories={setCategories}
          loading={loading}
          setLoading={setLoading}
        ></ParamSection>

        <ImageSection
          inspectingImage={inspectingImage}
          setInspectingImage={setInspectingImage}
          attributes={attributes}
          setAttributes={setAttributes}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
        ></ImageSection>
      </div>
    </ConfigProvider>
  );
}

export default App;
