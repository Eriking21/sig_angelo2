import { mapInterface } from "@/Map/interface";
import { CSSProperties, ChangeEvent } from "react";

import { FaSearch } from "react-icons/fa";

interface _ {
  isLarge?: boolean;
}

export const SearchBar = ({ isLarge = true }: _) => {
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    mapInterface.search.input = event.currentTarget;
    mapInterface.view?.popup.close();
    mapInterface.search.update();
  }

  function handleChange2(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    mapInterface.search.input = event.currentTarget
      .previousElementSibling! as any;
    mapInterface.view?.popup.close();
    mapInterface.search.update();
  }

  return (
    <form
      style={{
        margin: `.7em ${isLarge ? "1.15em" : "1rem"}`,
        alignSelf: "stretch",
        backgroundColor: "white",
        fontSize: " 1.5rem",
        padding: `0.4rem 1.5rem`,
        borderRadius: "1.5em",
        display: "flex",
        alignItems: "center",
      }}
    >
      <input
        style={inputStyle}
        placeholder="search.."
        id="searchBar"
        onChange={handleChange}
      />
      <button style={buttonStyle} onClick={handleChange2}>
        <FaSearch />
      </button>
    </form>
  );
};
const inputStyle: CSSProperties = {
  //margin: "0.5rem 0 0.5rem 1.5rem",
  backgroundColor: "transparent",
  fontSize: " 1.15rem",
  border: "none",
  overflow: "hidden",
  flex: 1,
  padding: 0,
 // color: "#61554dcf",
};
const buttonStyle: CSSProperties = {
  fontSize: " 1.15rem",
  border: "none",
  backgroundColor: "transparent",
  color: "#2277EE",

  padding: 0,
};
