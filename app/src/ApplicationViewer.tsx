import React from "react";
import { Application, Env } from "./StateOfTheWorld";

export const ApplicationEnvViewer = (props: { apps: any[] | undefined, components: any[] | undefined, currentApp: any, promoteEnvCallback: (from: string, to: string) => void }) => {
    const apps = props.apps?.filter(app => app.Project === props.currentApp?.Name);
    
    return (
        <div className="row" >
            {apps?.map(app => (
                <div className="col-sm-6" key={app.Name}>
                    <div className="card" >
                        <h5 className="card-header">
                            <div className="row">
                                <a className="col-sm-6" href={app.Url}>{app.Environment}</a>
                                <div className="btn-group col-sm-6">
                                    <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Promote</button>
                                    <div className="dropdown-menu">
                                        {
                                            apps?.map(env => (
                                                <a className="dropdown-item" onClick={() => props.promoteEnvCallback(app.Environment, env.Environment)} href="#">{env.Environment}</a>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </h5>
                        <div className="card-body">
                            <h6 className="card-title">Deployed components</h6>
                            <ul className="list-group">
                                {props.components?.filter(component => component.App === app.Name).map(component => (
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        {component.Name}
                                        <span className="badge badge-primary badge-pill">{component.DeployedVersion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


