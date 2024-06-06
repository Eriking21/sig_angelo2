"use client";
import React, { MouseEventHandler, ReactElement, useState } from "react";
import { CSSProperties } from "react";
import "./styles.css";

interface Props {
  key?: number | string;
  splash_norm?: number;
  content?: string | ReactElement;
  action: MouseEventHandler<HTMLButtonElement>;
  imgPadding?: CSSProperties["padding"][];
  splashAnimation?: string;
  bottom?: CSSProperties["bottom"];
  right?: CSSProperties["right"];
  translate?: CSSProperties["transform"];
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  border?: {
    width?: string;
    style?: string;
    color?: string[];
  };
  borderRadius?: CSSProperties["borderRadius"];
  backgroundColor?: CSSProperties["backgroundColor"][];
  className?: string;
  title?: string; // Add the title prop
}

const SplashButton = ({
  border = undefined,
  splash_norm,
  className,
  imgPadding,
  content,
  action,
  right = 0,
  bottom,
  translate,
  title,
  width = "56px",
  height = "56px",
  borderRadius = "50%",
  splashAnimation = "splashAnimation",
  backgroundColor = ["#93cbdd", "#d3eef7"],
  ...rest
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const getBorderColor = () =>
    border?.color
      ? !isHovered
        ? border.color[0]
        : border.color[1] ?? border.color[0]
      : "";

  const buttonStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding:
      imgPadding === undefined
        ? 0
        : !isHovered
        ? imgPadding[0]
        : imgPadding[1] ?? imgPadding[0],
    width: width,
    height: height,

    borderRadius: borderRadius,
    backgroundColor: !isHovered
      ? backgroundColor[0]
      : backgroundColor[1] ?? backgroundColor[0],

    color: " #6e6e6e",
    fontSize: !isHovered ? "1.25rem" : "1.4rem",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    placeContent: "center",
    transition: "background-color 0.2s ease-in-out",
    overflow: "hidden",
    border:
      border === undefined
        ? "none"
        : `${border.width ?? 1} ${border.style ?? "solid"} ${getBorderColor()}`,
  };

  const splashStyle: CSSProperties = {
    backgroundColor: "rgba(100, 123, 255, 0.5)",
    borderRadius: borderRadius,
    opacity: showSplash ? 1 : 0,
    animation: showSplash ? `${splashAnimation} 0.75s ease-in-out` : "none",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 0,
    height: 0,
    maxWidth: 100,
    maxHeight: 100,
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setShowSplash(true);
    action(event);
    setTimeout(() => {
      setShowSplash(false);
    }, 500 * (splash_norm ?? 1));
  };

  const positionedStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    border: "none",
    borderRadius: borderRadius,
    bottom: bottom,
    right: right,
    margin: "12px",
    transform: translate,
    opacity: translate === "none" ? 0 : 1,
    transition: "opacity .25s, transform .4s",
  };

  const iStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    background: "transparent",
  };

  const hasSrc =
    typeof content === "string" && (content[0] === "/" || content[0] === ".");

  return (
    <div style={positionedStyle} key={rest.key}>
      <div style={splashStyle}></div>
      <button
        className={className}
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        title={title}
      >
        {hasSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content} style={iStyle} alt="Add icon" />
        ) : (
          content
        )}
      </button>
    </div>
  );
};

export default SplashButton;
