import SideBar from "../SideBar";
import ArcGISMap from "@/Map";
import AddMenu from "@/AddMenu";
import { erimServerData } from "./api/data/types";

export default async function HomePage() {
  return (
    <>
      <ArcGISMap></ArcGISMap>
      <SideBar></SideBar>
      <AddMenu id="add-menu" />
    </>
  );
}
