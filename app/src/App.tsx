import React, { useState, useEffect } from 'react';
import './App.css';
import { Messages, Message } from './Messages';
import { StateOfTheWorld, Project } from './StateOfTheWorld';
import { ApplicationEnvViewer } from './ApplicationViewer';
import { PromoteEnv, PromoteEnvViewer } from './PromoteEnvViewer';

const apiHostname = "http://localhost:49245";

function App() {
  const [stateOfTheWorld, setStateOfTheWorld] = useState<StateOfTheWorld>();
  const [message, setMessage] = useState<Message>();
  const [currentApp, setCurrentApp] = useState<Project>();
  const [promoteEnv, setPromoteEnv] = useState<PromoteEnv>();

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
      <Messages message={message} />
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Promote Env</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {stateOfTheWorld?.AppProject?.map((app, index) => (
              <li key={index} className={currentApp === app ? "nav-item active" : "nav-item"} >
                <a className="nav-link" onClick={() => setCurrentApp(app)} href="#">{app.Name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav >

      <div className="container" >
        <ApplicationEnvViewer currentProject={currentApp} apps={stateOfTheWorld?.Apps} promoteEnvCallback={setPromoteEnv} components={stateOfTheWorld?.Components} />
      <PromoteEnvViewer promoteEnv={promoteEnv} components={stateOfTheWorld?.Components} />
    </div ></div>);
}

export default App;
