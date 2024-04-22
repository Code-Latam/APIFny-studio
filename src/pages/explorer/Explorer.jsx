
import ProductTree from "../../components/producttree/ProductTree";
import "./explorer.css" ;
import Topbar from "../../components/topbar/Topbar";

export default function Explorer({clientNr,explorerId, authorization}) {
  
  return (
    <>
      
      <div className="explorerContainer">
        <Topbar />
        <ProductTree 
        authorization={authorization}
        clientNr = {clientNr}
        explorerId = {explorerId}
        />
      </div>
      
    </>

  );
}
