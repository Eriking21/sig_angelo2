"use client";
import { HTMLAttributes, useEffect, useMemo, useState } from "react";
import SplashButton from "../utility/SplashButton";
import { PowerItem } from "../utility/options";
import { FaPlus, FaTimes } from "react-icons/fa";

export const filterForm = (form: any, result = form) =>
  typeof form === "number" && form < PowerItem.length ? result : undefined;

interface AddMenuButton {
  src: string;
  action: () => void;
}

type Props = HTMLAttributes<HTMLDivElement> & {
  onRight?: Boolean;
  R?: number;
  buttons?: AddMenuButton[];
};
export type FormIndex = (number & (0 | 1 | 2)) | undefined;

export const setForm = {
  isEditing: false,
  watchers: new Set<(i: FormIndex | null) => void>(),
  viewers: new Set<(i: FormIndex) => void>(),
  viewChange: new Set<(i: 0 | 1 | 2) => void>(),
  monitors: new Set<(i: boolean) => void>(),
  to: (i: FormIndex | null) => {
    try {
      if (i == undefined || i == null) {
        setForm.isEditing = false;
      }
      setForm.watchers.forEach((setTo) => setTo(i));
      setForm.viewers.forEach((setTo) => setTo(i ?? undefined));
      setForm.monitors.forEach((setTo) => setTo(typeof i === "number"));
      if (typeof i === "number") {
        setForm.viewChange.forEach((setTo) => setTo(i));
      }
    } catch (error) {
      console.log(error);
    }
  },
  useInit: () => {
    const [formIndex, setFormIndex] = useState<FormIndex | null>(undefined);
    useEffect(() => {
      setForm.watchers.add(setFormIndex);
      return () => {
        setForm.watchers.delete(setFormIndex);
      };
    }, []);
    return formIndex;
  },
  useListener: () => {
    const [formIndex, setFormIndex] = useState<FormIndex>(undefined);
    useEffect(() => {
      setForm.viewers.add(setFormIndex);
      return () => {
        setForm.viewers.delete(setFormIndex);
      };
    }, []);
    return formIndex;
  },
  useNumber: () => {
    const [isNumber, setIsNumber] = useState<boolean>(false);
    useEffect(() => {
      setForm.monitors.add(setIsNumber);
      return () => {
        setForm.monitors.delete(setIsNumber);
      };
    }, []);
    return isNumber;
  },
  useNumeric: (initial: 0 | 1 | 2 = 0) => {
    const [number, setNumber] = useState<typeof initial>(initial);
    useEffect(() => {
      setForm.viewChange.add(setNumber);
      return () => {
        setForm.viewChange.delete(setNumber);
      };
    }, []);
    return number;
  },
};

const AddMenu = ({ onRight = true, R = 90, style, ...rest }: Props) => {
  const formIndex = setForm.useInit();

  useEffect(() => {
    // Function to handle errors
    const handleError = (error:any) => {
      // Handle the error, e.g., log it or set an error state
      console.error("Caught an error:", error);
    };

    // Add the event listener for errors
    window.addEventListener("error", handleError);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []); // The empty array ensures the effect runs once after the initial render

  const is_adding = () => typeof formIndex === "number";
  const right = onRight ? 0 : undefined;
  const childs = useMemo(() => {
    return PowerItem.map(({ src }, index) => {
      const arc = Math.PI / 2 / (PowerItem.length - 1);
      const angle = -arc! * index;
      const X = R * Math.cos(angle) * (onRight ? -1 : 1);
      const Y = R * Math.sin(angle);
      const t = formIndex === null ? `translate(${X}px, ${Y}px)` : "none";

      return (
        <SplashButton
          backgroundColor={filterForm(formIndex, ["#93cbdd", "#ff0000e3"])}
          imgPadding={["16%", "13%"]}
          key={"M" + index}
          bottom={0}
          right={right}
          translate={t}
          content={src}
          action={() => setTimeout(() => setForm.to(index as 0 | 1), 300)}
        />
      );
    });
  }, [R, formIndex, onRight, right]).concat(
    <SplashButton
      key={"M" + PowerItem.length}
      backgroundColor={filterForm(formIndex, ["#93cbdd", "#ff0000e3"])}
      className={is_adding() ? "mainButton adding" : "mainButton"}
      content={filterForm(formIndex, <FaTimes color="white" />) ?? <FaPlus />}
      right={right}
      bottom={0}
      action={
        formIndex === undefined
          ? () => setForm.to(null)
          : formIndex === null
          ? () => setForm.to(undefined)
          : () => setTimeout(() => setForm.to(undefined), 100)
      }
    />
  );
  return (
    <div
      {...rest}
      style={{
        right: right,
        bottom: 0,
        position: "absolute",
        ...style,
      }}
    >
      {childs}
    </div>
  );
};

export default AddMenu;
