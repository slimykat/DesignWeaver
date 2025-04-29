import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, message } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Statistic } from "antd";
import { getUserData, setUserData } from "../api/firebase";
import "../styles/DesignRequirement.css";

const { Countdown } = Statistic;

const DesignRequirement = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const targetTime = React.useRef(0); // 8 minutes from now

  console.log("State: ", state);
  if (state == null) {
    console.log("State is null, redirecting to start page.");
    navigate("/Start");
  } else {
    if (state.startTime == undefined || state.startTime == null) {
      console.log(
        "State.startTime is null, add this attribute to the user for testing purposes."
      );
      state.startTime = new Date().getTime();
      setUserData(state.name, "startTime", state.startTime).then(() => {
        confirm("State.startTime is added to the user data.");
      });
      targetTime.current = state.startTime + 1000 * 60 * 8 + 3000; // 8 minutes
    } else {
      targetTime.current = state.startTime + 1000 * 60 * 8; // 8 minutes
      if (new Date().getTime() > targetTime.current) {
        message.warning({
          content: "Time's up. Please move on to the next page.",
          duration: 0,
          key: "timeup",
        });
      }
    }
  }

  const handleNextStep = async () => {
    message.destroy("timeup");
    getUserData(state.name).then((userData) => {
      if (userData.designReqFinishTime != undefined) {
        state.designReqFinishTime = userData.designReqFinishTime;
        navigate("/ToolInstruction", { state });
      } else {
        state.designReqFinishTime = new Date().getTime();
        setUserData(
          state.name,
          "designReqFinishTime",
          state.designReqFinishTime
        ).then(() => {
          navigate("/ToolInstruction", { state });
        });
      }
    });
  };

  return (
    <div className="design-requirement-container">
      <div className="DesignR-Countdown-Wrapper">
        <p>
          <b>
            Feel free to reread the{" "}
            <a
              href="/assets/UCSD-participant-consent-form-EADT.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              consent form
            </a>{" "}
            you received in email after the sign-up. In this study, you will be
            role-playing as a designer who was hired to come up with a
            customized dining chair design for a client named David. Please read
            the PDF below that catalogs an email correspondence with and
            information about your client. Spend a few minutes to understand the
            details of the design task and your client. In the next stage, you
            will create some designs to fit the client&apos;s needs. Advance to
            the Next step whenever you are ready.
          </b>
        </p>
        <div className="Countdown-Title">
          <ClockCircleOutlined style={{ marginRight: "5px" }} />
          <Countdown
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
          onClick={handleNextStep}
          className="floating-next-button"
        >
          Next
        </Button>
      </div>

      <iframe
        src="/assets/Chair-Design-Requirement.pdf"
        title="Design Requirement PDF"
        className="design-requirement-iframe"
      ></iframe>
    </div>
  );
};

export default DesignRequirement;
