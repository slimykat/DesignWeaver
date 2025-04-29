import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, message } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Statistic } from "antd";
import { setUserData, getUserData } from "../api/firebase";
import "../styles/ToolInstruction.css";

const { Countdown } = Statistic;

const ToolInstruction = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const targetTime = useRef(0); // Timer end time
  const [timerKey, setTimerKey] = useState(0); // Key to reset the timer

  useEffect(() => {
    if (state == null) {
      console.log("State is null, redirecting to start page.");
      navigate("/Start");
    } else {
      // Fetch the finish time or set it if it doesn't exist
      getUserData(state.name).then((userData) => {
        if (userData.designReqFinishTime != undefined) {
          targetTime.current = userData.designReqFinishTime + 1000 * 60 * 5; // 5 minutes
          setTimerKey((prevKey) => prevKey + 1); // Update key to refresh the timer
        } else {
          const currentTime = new Date().getTime();
          state.instructFinishTime = currentTime;
          setUserData(state.name, "instructFinishTime", currentTime).then(
            () => {
              targetTime.current = currentTime + 1000 * 60 * 5; // 5 minutes
              setTimerKey((prevKey) => prevKey + 1); // Update key to refresh the timer
            }
          );
        }
      });
    }
  }, [navigate, state]);

  // check state.group to determine the  source
  let pdfSource =
    state === undefined || state.group !== "A"
      ? "/assets/Tool_Instruction.pdf"
      : "/assets/Tool-Instruction.pdf";
  let navigateTarget =
    state === undefined || state.group !== "A" ? "/Interface" : "/Application";
  const handleNextClick = async () => {
    message.destroy("timeup");

    if (state != null) {
      // Sync user data with the server
      getUserData(state.name).then((userData) => {
        if (userData.instructFinishTime != undefined) {
          state.instructFinishTime = userData.instructFinishTime;
          navigate(navigateTarget, { state });
        } else {
          state.instructFinishTime = new Date().getTime();
          setUserData(
            state.name,
            "instructFinishTime",
            state.instructFinishTime
          ).then(() => {
            navigate(navigateTarget, { state });
          });
        }
      });
    }
  };

  return (
    <div className="tool-instruction-container">
      <div className="tool-instruction-wrapper">
        <div className="Tool-Countdown-Wrapper">
          <p className="tool-instruction-text">
            <b>
              For the design phase, you will be working in a new AI design tool
              as described in the slides below. Please take 5 minutes to review
              all the slides to understand what to expect on the next page.
              These instructions will be available in a separate tab while you
              explore designs. Advance to the Next step whenever you are ready.
            </b>
          </p>
          <div className="Countdown-Title">
            <ClockCircleOutlined style={{ marginRight: "5px" }} />
            <Countdown
              key={timerKey} // Use key to ensure the timer resets when necessary
              id="clock"
              format="mm:ss"
              value={targetTime.current}
              valueStyle={{ fontSize: "medium", color: "black" }} // Ensure color is black
              onFinish={() => {
                message.warning({
                  content: "Time's up. Please move on to the next page.",
                  duration: 0,
                  key: "timeup",
                });
              }}
            />
          </div>
          <Button
            type="primary"
            onClick={handleNextClick}
            className="floating-next-button"
          >
            Next
          </Button>
        </div>
      </div>
      <iframe
        src={pdfSource}
        title="Tool Instruction"
        className="tool-instruction-iframe"
      ></iframe>
    </div>
  );
};

export default ToolInstruction;
