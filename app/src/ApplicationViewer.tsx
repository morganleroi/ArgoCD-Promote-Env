import React from "react";
import { AppProject, ComponentApp, Project } from "./StateOfTheWorld";
import { PromoteEnv } from "./PromoteEnvViewer";

export const ApplicationEnvViewer = (props: { apps: AppProject[] | undefined, components: ComponentApp[] | undefined, currentProject: Project | undefined, promoteEnvCallback: (promoteEnv: PromoteEnv) => void }) => {
    if (props.currentProject === undefined) {
        return (
            <div className="row" >
                <p>Please select a project</p>
            </div>
        );
    }

    const apps = props.apps?.filter(app => app.Project === props.currentProject?.Name);
    return (
        <div className="row" >
            {apps?.map(app => (
                <div className="col-sm-6" key={app.Name + '-' + app.Project}>
                    <div className="card" >
                        <h5 className="card-header">
                            <div className="row">
                                <a className="col-sm-6" href="#" >{app.Environment}</a>
                                <div className="btn-group col-sm-6">
                                    <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Promote</button>
                                    <div className="dropdown-menu">
                                        {
                                            apps?.map(env => (
                                                <a key={env.Environment} className="dropdown-item" onClick={() => props.promoteEnvCallback({
                                                    from: app, to: env, project: props.currentProject!
                                                })} >{env.Environment}</a>
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
                                    <li key={component.Name} className="list-group-item d-flex justify-content-between align-items-center">
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


