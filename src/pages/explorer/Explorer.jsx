
import ProductTree from "../../components/producttree/ProductTree";
import "./explorer.css" ;
import Topbar from "../../components/topbar/Topbar";

export default function Explorer({clientNr,explorerId, designerMode}) {
  console.log("DESIGNERMODE");
  console.log(designerMode);
  console.log(clientNr);
  return (
    <>
      
      <div className="explorerContainer">
        <Topbar />
        <ProductTree 
        designerMode={designerMode}
        clientNr = {clientNr}
        explorerId = {explorerId}
        />
      </div>
      
    </>

  );
}
