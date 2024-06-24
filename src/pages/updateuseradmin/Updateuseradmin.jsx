import axios from "axios";
import { useRef, useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHistory, useLocation } from "react-router";
import { encodebody, getDecodedBody } from "../../utils/utils.js";
import "./updateuseradmin.css";

export default function Updateuseradmin() {
    const location = useLocation();
    const { targetuser, explorerId } = location.state;

    const formRef = useRef(null);
    const [explorer, setExplorer] = useState(null);
    const [loadingExplorer, setLoadingExplorer] = useState(true);

    const history = useHistory();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchExplorerData = async () => {
            const myPayload = {
                clientNr: user.clientNr,
                chatbotKey: user.chatbotKey,
                email: targetuser.email // Use targetuser's email here
            };
            try {
                const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/users/query", encodebody(myPayload));
                const responseData = getDecodedBody(response.data);

                const explorerData = responseData.explorers.find(exp => exp.name === explorerId);
                setExplorer(explorerData);
            } catch (error) {
                console.error("Error fetching explorer data:", error);
            } finally {
                setLoadingExplorer(false);
            }
        };

        fetchExplorerData();
    }, [user, targetuser, explorerId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExplorer((prevExplorer) => ({
            ...prevExplorer,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setExplorer((prevExplorer) => ({
            ...prevExplorer,
            [name]: checked
        }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const updatedExplorers = targetuser.explorers.map(exp =>
            exp.name === explorer.name ? explorer : exp
        );

        const updatedUser = {
            clientNr: user.clientNr,
            chatbotKey: targetuser.chatbotKey,
            email: targetuser.email,
            explorers: updatedExplorers
        };

        const body = encodebody(updatedUser);
        try {
            await axios.post(process.env.REACT_APP_CENTRAL_BACK + `/users/update/`, body);
            alert("User has been updated");
            history.goBack();
        } catch (err) {
            alert("Error during save operation: " + (err.response ? JSON.stringify(getDecodedBody(err.response.data)) : err.message));
        }
    };

    return (
        <div className="user">
            <div className="userWrapper">
                <div className="userRight">
                    <form ref={formRef} className="userBox" onSubmit={handleClick}>
                        <input
                            defaultValue={targetuser.email}
                            className="userInputEmail"
                            disabled
                        />
                        <label className="userLabel">Explorer Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={explorer?.name || ''}
                            onChange={handleInputChange}
                            className="userInput"
                            disabled
                        />
                        <label className="userLabel">
                            <input
                                type="checkbox"
                                name="designer"
                                checked={explorer?.designer || false}
                                onChange={handleCheckboxChange}
                            /> Designer
                        </label>
                        <label className="userLabel">
                            <input
                                type="checkbox"
                                name="owner"
                                checked={explorer?.owner || false}
                                onChange={handleCheckboxChange}
                            /> Owner
                        </label>
                        <label className="userLabel">
                            <input
                                type="checkbox"
                                name="reader"
                                checked={explorer?.reader || false}
                                onChange={handleCheckboxChange}
                            /> Reader
                        </label>
                        <button className="userButton" type="submit" disabled={loadingExplorer}>
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
