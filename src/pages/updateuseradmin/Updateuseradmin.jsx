import axios from "axios";
import { useRef, useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHistory, useLocation } from "react-router";
import { encodebody, getDecodedBody } from "../../utils/utils.js";
import Select, { components }   from 'react-select';
import "./updateuseradmin.css";

export default function Updateuseradmin() {
    const location = useLocation();
    const { targetuser } = location.state;

    const formRef = useRef(null);
    const [selectedExplorers, setSelectedExplorers] = useState([]);
    const [explorersPredefined, setExplorersPredefined] = useState([]);
    const [loadingExplorers, setLoadingExplorers] = useState(true);

    const history = useHistory();
    const { user } = useContext(AuthContext);

    const selectStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'black',
            borderColor: state.isFocused ? '#5cb85c' : '#4cae4c',
            boxShadow: state.isFocused ? '0 0 0 1px #5cb85c' : 'none',
            borderRadius: '10px',
            height: '50px',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#98FF98',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: 'black',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: 'black',
            ':hover': {
                backgroundColor: '#4cae4c',
            },
        }),
    };

    const Option = ({ data, onChangeRole, ...props }) => {
      return (
          <components.Option {...props}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{data.label}</span>
                  <div>
                      <label>
                          <input
                              type="checkbox"
                              checked={data.designer}
                              onChange={() => onChangeRole(data, 'designer')}
                          /> Designer
                      </label>
                      <label>
                          <input
                              type="checkbox"
                              checked={data.owner}
                              onChange={() => onChangeRole(data, 'owner')}
                          /> Owner
                      </label>
                      <label>
                          <input
                              type="checkbox"
                              checked={data.reader}
                              onChange={() => onChangeRole(data, 'reader')}
                          /> Reader
                      </label>
                  </div>
              </div>
          </components.Option>
      );
  };
  

 

  useEffect(() => {
    const fetchExplorerData = async () => {
        const myPayload = {
            clientNr: user.clientNr,
            chatbotKey: user.chatbotKey,
            email: user.email
        };
        try {
            const response = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/users/query", encodebody(myPayload));
            const responseData = getDecodedBody(response.data);
            let explorerOptions = responseData.explorers.map(explorer => ({
                name: explorer.name,
                label: `workspace name: ${explorer.name} (designer: ${explorer.designer ? 'Yes' : 'No'}, owner: ${explorer.owner ? 'Yes' : 'No'}, reader: ${explorer.reader ? 'Yes' : 'No'})`,
                designer: explorer.designer,
                owner: explorer.owner,
                reader: explorer.reader
            }));

            // Adjust explorerOptions to reflect targetuser's roles

            setExplorersPredefined(explorerOptions);
            console.log("USER EXPLORERS");
            console.log(explorerOptions);

            let targetExplorers = targetuser.explorers.map(explorer => ({
              name: explorer.name,
              label: `workspace name: ${explorer.name} (designer: ${explorer.designer ? 'Yes' : 'No'}, owner: ${explorer.owner ? 'Yes' : 'No'}, reader: ${explorer.reader ? 'Yes' : 'No'})`,
              designer: explorer.designer,
              owner: explorer.owner,
              reader: explorer.reader
          }));

            setSelectedExplorers(targetExplorers);
            console.log("SELECTED EXPLORERS");
            console.log(targetExplorers);
        } catch (error) {
            console.error("Error fetching explorer data:", error);
        } finally {
            setLoadingExplorers(false);
        }
    };

    fetchExplorerData();
}, [user, targetuser]);

  
const onRoleChange = (option, role) => {
  const updatedOptions = explorersPredefined.map(exp => {
      if (exp.name === option.name) {
          const newRoleValue = !exp[role];
          return {
              ...exp,
              [role]: newRoleValue,
              label: `workspace name: ${exp.name} (designer: ${role === 'designer' ? newRoleValue ? 'Yes' : 'No' : exp.designer ? 'Yes' : 'No'}, owner: ${role === 'owner' ? newRoleValue ? 'Yes' : 'No' : exp.owner ? 'Yes' : 'No'}, reader: ${role === 'reader' ? newRoleValue ? 'Yes' : 'No' : exp.reader ? 'Yes' : 'No'})`
          };
      }
      return exp;
  });
  setExplorersPredefined(updatedOptions);
  setSelectedExplorers(updatedOptions.filter(exp => selectedExplorers.find(se => se.name === exp.name)));
};

const handleClick = async (e) => {
  e.preventDefault();
  console.log("explorers");
  console.log(selectedExplorers);
  const newExplorers = selectedExplorers.map(({ label, ...rest }) => rest);

  const updatedUser = {
      clientNr: user.clientNr,
      chatbotKey: targetuser.chatbotKey,
      email: targetuser.email,
      explorers: newExplorers
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



const handleSelectedExplorersChange = (selectedOptions) => {
  setSelectedExplorers(selectedOptions);
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
                        <label className="userLabel">Member of the following workspaces:</label>
                        {!loadingExplorers && (
                          <Select
                          isMulti
                          components={{
                              Option: (props) => <Option {...props} onChangeRole={onRoleChange} />
                          }}
                          options={explorersPredefined}
                          value={selectedExplorers}
                          onChange={handleSelectedExplorersChange}
                          getOptionLabel={(option) => option.label}
                          getOptionValue={(option) => option.name}
                          placeholder="Select explorers and set roles"
                          styles={selectStyles}
                      />
                        )}
                        <button className="userButton" type="submit">
                          Update
                        </button>
                        
                    </form>
                </div>
            </div>
        </div>
   

  );
}
