import React, { useState, useEffect } from "react";

type TextAlign =
  | "left"
  | "right"
  | "center"
  | "justify"
  | "initial"
  | "inherit";

interface TypingEffectProps {
  text: string;
  backgroundColor?: string;
  width?: number;
  textAlign?: TextAlign | undefined;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  backgroundColor = "lightpink",
  width = 300,
  textAlign = "left",
}) => {
  const [textIndex, setTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    const typingEffect = () => {
      if (textIndex < [text].length) {
        const fullText = [text][textIndex];
        setCurrentText(fullText.substring(0, currentText.length + 1));
      } else {
        setCurrentText("");
        setTextIndex(0);
      }
    };

    const typingInterval = setInterval(typingEffect, 100); // Adjust the typing speed

    return () => clearInterval(typingInterval);
  }, [textIndex, currentText, text]);

  return (
    <div style={{ width: width }}>
      <h1
        style={{
          margin: 0,
          textAlign: textAlign,
          backgroundColor: backgroundColor,
        }}
      >
        {currentText}
      </h1>
    </div>
  );
};

export default TypingEffect;
