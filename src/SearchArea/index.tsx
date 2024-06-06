import { CSSProperties } from "react";
import { SearchBar } from "./SearchBar";
import  SearchBox from "./searchBox";
import "./styles.css";

export default function SearchArea () {

  return (
    <div {...{ style }}>
      <SearchBar />
      <SearchBox />
    </div>
  );
};

  const style: CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    alignItems: "center",
    overflow: "hidden",
  };