import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Message } from './Message';
import { Messages } from './Messages';
import { StateOfTheWorld, Application, Env } from './StateOfTheWorld';
import { ApplicationEnvViewer } from './ApplicationViewer';

const apiHostname = "http://localhost:49245";

function App() {
  const [stateOfTheWorld, setStateOfTheWorld] = useState<StateOfTheWorld | undefined>();
  const [message, setMessage] = useState<Message | undefined>(undefined);
  const [currentApp, setCurrentApp] = useState<any>();

const promoteEnvCallback = (from:string, to:string) => {
  console.log("Ok, alors ...");
  console.log("From" + from);
  console.log("To" + to);
}

  useEffect(() => {
    fetch(`${apiHostname}/`).then(async resp => {
      if (resp.ok) {
        setStateOfTheWorld(await resp.json())
      }
      else {
        setMessage({ value: "Fail to fetch Apps", type: "Error" });
      }
    }).catch(t => {
      setMessage({ value: "Fail to fetch Apps", type: "Error" });
    });
  }, []);

  return (
    <div>
      <Messages {...message} />

      <ul className="nav nav-pills nav-fill">
        {stateOfTheWorld?.AppProject?.map((app, index) => (
          <li key={index} className="nav-item">
            <a
              className={currentApp === app ? "nav-link active" : "nav-link"}
              onClick={() => setCurrentApp(app)} href="#">{app.Name}
            </a>
          </li>
        ))}
      </ul>

      <ApplicationEnvViewer currentApp={currentApp} apps={stateOfTheWorld?.Apps} promoteEnvCallback={promoteEnvCallback} components={stateOfTheWorld?.Components} />
    </div>);
}

export default App;
