import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link, useHistory  } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const history = useHistory();

  function handleClick() {
    const confirmed = window.confirm(
      `Are you sure you want to sign out. Please make sure you have your credentials at hand in case you want to sign in again!`
    );
    if (confirmed) {
      localStorage.removeItem("user");
      localStorage.removeItem("gwocu-setting");
      history.push('/');
      window.location.reload(true);
      //history.go(0);
      }
  }

  const { user} = useContext(AuthContext);
  const gwocuSettingsString = localStorage.getItem("gwocu-setting");
  const gwocuSettings = gwocuSettingsString ? JSON.parse(gwocuSettingsString) : null;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
      <a href={gwocuSettings.url} target="_blank" style={{ textDecoration: "none" }}>
      <div className="logotext">
        {gwocuSettings.clientNr} GWOCU Studio: 
        <span style={{ fontSize: 'smaller' }}>{user.explorerId}</span>
      </div>
      </a>
      </div>
      <div className="topbarCenter">
        
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
        <span className="topbarLink" onClick={handleClick}>
        Sign Out
        </span>
        <a target="_blank" className="topbarLink" href="https://wiki.gwocu.com/en/GWOCU-Studio/GWOCU-Studio">Wiki</a>    
        </div>
        
        
        <Link to={`/updateuser/`} className="user-container">   
         <div>{user.username}</div>
        </Link>
      </div>
    </div>
  );
}
