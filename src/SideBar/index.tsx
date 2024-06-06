"use client";
import SearchArea from "@/SearchArea";
import {CopyRight, language, Language } from "@/utility/Language";
import { useEffect, useState } from "react";
import Resizer from "./resizer";
import AddingForm from "@/AddingForm";

const Logo = ({ isLarge = true }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/logo.png"
    alt="SIG Logo"
    style={{
      alignSelf: "center",
      height: isLarge ? "calc(4rem + 5%)" : "2.5em",
      margin: isLarge ? "calc(.5rem + 5%) 1em 1%" : "1rem 0px 1rem 1rem",
      boxSizing: "border-box",
    }}
  />
);

export default function SideBar() {
  const [write, setLanguage] = useState<Language>(language["PT"]);
  useEffect(() => {}, []);
  return (
    <>
      <Resizer />
      <aside
        className="bg-grad-erim flex flex-col overflow-hidden relative"
        style={{
          display: "flex",
          transform: "none",
          width: "350px",
          height: "100% ",
          flexDirection: "column",
          left: 0,
        }}
      >
        <AddingForm write={write} />
        <Logo />
        <SearchArea />
        {<CopyRight {...write.DEV} />}
      </aside>
    </>
  );
}
