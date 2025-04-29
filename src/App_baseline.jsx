import "./styles/App.css";
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import ImageSection from "./components/ImageSection";
import ParamSection_Baseline from "./components/ParamSection_Baseline";
import { getUserData, setUserData } from "./api/firebase";

function App_baseline() {
  let { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notFinished, setNotFinished] = useState(true);
  const [extraMinuteStarted, setExtraMinuteStarted] = useState(false);

  if (state == null) {
    console.log("State is null, redirecting to start page.");
    navigate("/Start");
  }

  const targetTime = useRef(0); // 15 minutes from now
  const extraMinuteTime = useRef(0); // Extra 1 minute timer

  if (state != null && state.instructFinishTime != undefined) {
    targetTime.current = state.instructFinishTime + 1000 * 60 * 15;
    extraMinuteTime.current = targetTime.current + 1000 * 60; // 1 minute after the 15 minutes
  }

  useEffect(() => {
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
      handleNextClick(); // Force navigation after 1 minute
    }
  }, [extraMinuteStarted, notFinished]);

  const handleNextClick = () => {
    if (loading) {
      return;
    }
    // sync user data with the server
    message.destroy("timeup");
    getUserData(state.name).then((userData) => {
      if (userData.taskFinishedTime != undefined) {
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

  const [selectedImageId, setSelectedImageId] = useState([]);
  const [inspectingImage, setInspectingImage] = useState(null);
  const [attributes, setAttributes] = useState({
    userID: state ? state.name : "BaselineTest",
    group: state ? state.group : "A",
    prompt: "",
    images: [],
  });

  return (
    <ConfigProvider locale={en_US}>
      <div className="task-instruction-container">
        <div className="task-instruction-text">
          <p>
            Your goal now is to explore different design concepts for a chair to
            satisfy your client&apos;s needs. You have 15 minutes to create
            prompts that will generate images of chairs. Use the{" "}
            <b>
              <HeartTwoTone twoToneColor="#eb2f96" /> heart icon
            </b>{" "}
            to add images to your favorites. In the next stage, you will pick
            one chair for your client from your favorites list. You can only
            advance to the Next step after 15 minutes. (
            <a href="/assets/Chair-Design-Requirement.pdf" target="_blank">
              <OrderedListOutlined />
              Design Requirements
            </a>{" "}
            |{" "}
            <a
              href="/assets/Tool-Instruction.pdf"
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
                setNotFinished(false); // Allow navigation after the 15 minutes
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
        <ParamSection_Baseline
          attributes={attributes}
          setAttributes={setAttributes}
          loading={loading}
          setLoading={setLoading}
        ></ParamSection_Baseline>
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

export default App_baseline;
