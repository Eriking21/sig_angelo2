"use client";
import { MouseEventHandler, useMemo } from "react";
import "./styles.css";
import { release } from "os";
import { setForm } from "@/AddMenu";

interface ResizerContent {
  min: number;
  max: number;
  restore: () => void;
  release: () => void;
  bar: HTMLDivElement | null;
  target: HTMLElement | null;
  parent: HTMLElement | null;
  resizerCenter: number | null;
  onMouseDown: MouseEventHandler<HTMLDivElement>;
  onDoubleClick: MouseEventHandler<HTMLDivElement>;
  HandleResize: (this: Window, ev: WindowEventMap["mousemove"]) => void;
}

export default function Resizer() {
  const isNumber = setForm.useNumber();
  const resizer: ResizerContent = useMemo(
    () => ({
      target: null,
      parent: null,
      bar: null,
      min: 0,
      max: 0,
      resizerCenter: 0,
      onMouseDown: (event) => {
        if (
          resizer.bar != event.currentTarget ||
          (resizer.parent?.clientWidth ?? 3) * 0.45 !== resizer.max
        ) {
          resizer.bar = event.currentTarget;
          resizer.parent = event.currentTarget.parentNode as any;
          resizer.target = event.currentTarget.nextElementSibling as any;
          resizer.resizerCenter = event.currentTarget.clientWidth / 2;
          resizer.max = resizer.parent!.clientWidth * 0.45;
          resizer.min = Math.min(300, resizer.max);
        }
        event.detail !== 2 && event.preventDefault();

        window.addEventListener("mousemove", resizer.HandleResize);
        window.addEventListener("mouseup", resizer.release);
        window.addEventListener("mouseleave", resizer.release);
      },
      onDoubleClick: (event): void => {
        if (resizer.target!.style.transform === "none") {
          setForm.to(undefined);
          resizer.target!.style.transform = `translateX(-100%)`;
          resizer.target!.style.position = `absolute`;
          resizer.bar!.style.cursor = "pointer";
        } else {
          resizer.restore();
        }
        resizer.release();
      },
      HandleResize: function (this, ev): void {
        let pos = ev.clientX - resizer.resizerCenter!;
        if (pos < resizer.min) {
          pos = resizer.min;
          release();
        } else if (pos > resizer.max) {
          pos = resizer.max;
          release();
        }
        resizer.target!.style.width = `${pos}px`;
      },
      release: (): void => {
        window.removeEventListener("mousemove", resizer.HandleResize);
        window.removeEventListener("mouseup", resizer.release);
        window.removeEventListener("mouseleave", resizer.release);
      },
      restore: () => {
        if (!resizer.target) return;
        resizer.target!.style.transform = "none";
        resizer.target!.style.position = "";
        resizer.bar!.style.cursor = "";
      },
    }),
    []
  );

  if (isNumber) {
    resizer.restore();
  }
  return (
    <div
      className={"cursor-ew-resize h-full"}
      id="resizer"
      onMouseDown={resizer.onMouseDown}
      onDoubleClick={resizer.onDoubleClick}
    ></div>
  );
}
