import { Button } from "antd";
import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type TextAlign =
  | "left"
  | "right"
  | "center"
  | "justify"
  | "initial"
  | "inherit";

interface CardProps {
  text: string;
  images: string[];
  description: string;
  tag: string[];
  backgroundColor?: string;
  initialWidth?: number;
  hoveredWidth?: number;
  initialHeight?: number;
  hoveredHeight?: number;
  textAlign?: TextAlign | undefined;
}

type Action = { type: "INCREMENT" } | { type: "DECREMENT" };

const imageIndexReducer = (state: number, action: Action): number => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};

const CardLandingPage: React.FC<CardProps> = ({
  text,
  images,
  description,
  tag,
  backgroundColor = "lightpink",
  initialWidth = 300,
  hoveredWidth = 310,
  initialHeight = 300,
  hoveredHeight = 310,
  textAlign = "center",
}) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);

  return (
    <div
      style={{
        width: hovered ? hoveredWidth : initialWidth,
        height: hovered ? hoveredHeight : initialHeight,
        backgroundColor: "lightsalmon",
        borderRadius: "15px",
        zoom: hovered ? "normal" : "initial",
        transition: "width 0.3s, height 0.3s",
      }}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <div
        style={{
          backgroundColor: "lightsalmon",
          backgroundImage: `url(${images[imageIndex]})`, // Set the background image URL
          backgroundSize: "cover", // Adjust according to your needs
          backgroundPosition: "center", // Adjust according to your needs
          minHeight: "200px",
          borderRadius: "15px 15px 15px 15px",
          display: "flex",
          alignItems: "end",
          padding: "15px",
          color: "black",
        }}
      >
        <div
          style={{
            minHeight: "70px",
            display: "flex",
            flexDirection: "column",
            alignContent: "end",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FaArrowLeft
              onClick={() => {
                setImageIndex(
                  (prevIndex) => (prevIndex - 1 + images.length) % images.length
                );
              }}
              style={{
                cursor: "pointer",
                color: "white",
                filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.5))",
              }}
            />
            <FaArrowRight
              onClick={() => {
                setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
              }}
              style={{
                cursor: "pointer",
                color: "white",
                filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.5))",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "start" }}>
            {tag.length
              ? tag.map((value) => {
                  return (
                    <span
                      style={{
                        backgroundColor: "lightcyan",
                        borderRadius: "5px",
                        fontSize: "10px",
                        padding: "5px",
                      }}
                    >
                      {value}
                    </span>
                  );
                })
              : []}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: 15,
          backgroundColor: "lightskyblue",
          borderRadius: "0px 0px 15px 15px",
        }}
      >
        <h1
          style={{
            margin: 0,
            padding: 0,
            textAlign: textAlign,
            color: "black",
          }}
        >
          {text}
        </h1>
        <p style={{ textAlign: "left", color: "black" }}>{description}</p>
        <Button>Conheça {text}</Button>
      </div>
    </div>
  );
};

export default CardLandingPage;
