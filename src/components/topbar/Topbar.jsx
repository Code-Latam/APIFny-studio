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
 console.log("gwocuSettings");
 console.log(gwocuSettings);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
      <a href={gwocuSettings.url} target="_blank" style={{ textDecoration: "none" }}>
      <div className="logotext">{gwocuSettings.clientname} GWOCU Studio</div>
      </a>
      </div>
      <div className="topbarCenter">
        
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
        <span className="topbarLink" onClick={handleClick}>
        Sign Out of the GWOCU Studio
        </span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/updateuser/`} className="user-container">   
         <div>{user.username}</div>
        </Link>
      </div>
    </div>
  );
}
