import React, { useState, useEffect } from 'react';
import "./linkview.css";
import axios from "axios";

function Linkview({ clientNr, explorerId, workflowName, mylink }) {

  const [link, setLink] = useState(mylink);
  const [sourceAndTargetNames, setSourceAndTargetNames] = useState({sourceName:"",targetName:""});

  console.log('LINKVIEW');
  console.log(mylink)

  useEffect(() => {
    // Define the API URL for fetching the product

        // fetch the source name and target name of the nodes
        fetch();
  }, [workflowName,mylink]);

  async function fetch() {
    const myPayloadSource = {
      clientNr: clientNr,
      explorerId: explorerId,
      workflowName: workflowName,
      taskId: mylink.source

    }
    const myPayloadTarget = {
      clientNr: clientNr,
      explorerId: explorerId,
      workflowName: workflowName,
      taskId: mylink.target

    }

    const myResponseSource = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/task/query", myPayloadSource )
    const myResponseTarget = await axios.post(process.env.REACT_APP_CENTRAL_BACK + "/task/query", myPayloadTarget )
     
    console.log("AFTER FETCH");
    console.log(myResponseSource.data.name);


    const mySourceAndTargetNames = {
      sourceName: myResponseSource.data.name,
      targetName: myResponseTarget.data.name
    }

    setSourceAndTargetNames(mySourceAndTargetNames)
    setLink(mylink);

  }

  return (
    <div className="Taskview">
      <div>
        
        {link ? (
          <div>
            <div>
              <label htmlFor="source">Source</label>
              <br />
              <input
                type="text"
                id="source"
                value={sourceAndTargetNames.sourceName}
                className="LinkViewinputname"
                disabled
              />
            </div>
            <div>
              <label htmlFor="target">Target</label>
              <br />
              <input
                type="text"
                id="target"
                value={sourceAndTargetNames.targetName}
                className="LinkViewinputname"
                disabled
              />
            </div>
          </div>
        ) : (
          <p>Loading Link information...</p>
        )}
      </div>
    </div>
  );
}

export default Linkview;
