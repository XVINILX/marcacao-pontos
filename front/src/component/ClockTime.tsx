import React, { useState, useEffect } from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdMotionPhotosPaused } from "react-icons/md";
import {
  formatMinutesToHoursAndMinutes,
  formatSecondsToHoursAndMinutes,
} from "utils/formatTime";
interface PunchClockTimerProps {
  onToggle: () => void;
  isRunning: boolean;
  initialMinutes: number;
}

const PunchClockTimer: React.FC<PunchClockTimerProps> = ({
  onToggle,
  isRunning,
  initialMinutes,
}) => {
  const [elapsedTime, setElapsedTime] = useState(initialMinutes);

  useEffect(() => {
    const setTime = () => {
      setElapsedTime((e) => e + 1);
    };

    if (isRunning) {
      const interval = setInterval(() => setTime(), 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    setElapsedTime(initialMinutes * 60);
  }, [initialMinutes]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "25px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
        }}
      >
        <h4
          style={{
            fontFamily: "Montserrat",
            fontWeight: 300,
            fontSize: "12px",
            width: "100%",
            color: "white",
            textAlign: "left",
            margin: 0,
          }}
        >
          {formatSecondsToHoursAndMinutes(elapsedTime)}
        </h4>
        <b
          style={{
            fontWeight: 800,
            textAlign: "left",
            color: "white",
          }}
        >
          Hora de hoje
        </b>
      </div>

      {!isRunning ? (
        <FaRegCirclePlay
          color="red"
          size={"30px"}
          style={{ cursor: "pointer" }}
          onClick={onToggle}
        />
      ) : (
        <MdMotionPhotosPaused
          color="red"
          size={"30px"}
          style={{ cursor: "pointer" }}
          onClick={onToggle}
        />
      )}
    </div>
  );
};

export default PunchClockTimer;
