import React from "react";
import { AppProject, Project, ComponentApp } from "./StateOfTheWorld";

export type PromoteEnv = {
    project: Project,
    from: AppProject,
    to: AppProject
}

export type AppPromotion = {
    projectName: string;
    fromEnv: string,
    toEnv: string,
    valueFilePath: string;
    componentsToPromote: ComponentToPromote[]
}

export type ComponentToPromote = {
    componentName: string;
    newVersion: string;
};

type ComponentPromotionViewer = {
    componentName: string;
    oldVersion?: string;
    newVersion?: string;
}

export const PromoteEnvViewer = (props: { promoteEnv: PromoteEnv | undefined, components: ComponentApp[] | undefined }) => {


    const fromEnvComponents = props.components?.filter(c => c.App === props.promoteEnv?.from.Name);
    const toEnvComponents = props.components?.filter(c => c.App === props.promoteEnv?.to.Name);

    const componentPromotions: ComponentPromotionViewer[] = [];
    fromEnvComponents?.forEach(c => {
        const oldComponent = toEnvComponents?.find(oldComponent => oldComponent.Name === c.Name);
        componentPromotions.push({
            componentName: c.Name,
            newVersion: c.DeployedVersion.split(':').pop(),
            oldVersion: oldComponent?.DeployedVersion.split(':').pop()
        })
    });

    async function startPromotion() {

        const componentsToPromote: ComponentToPromote[] = [];
        const fromEnvComponents = props.components?.filter(c => c.App === props.promoteEnv?.from.Name);
        fromEnvComponents?.forEach(x => componentsToPromote.push({
            componentName: x.Name,
            newVersion: x.DeployedVersion
        }));

        const appPromotion: AppPromotion = {
            projectName: props.promoteEnv?.project.Name!,
            fromEnv: props.promoteEnv?.from.Environment!,
            toEnv: props.promoteEnv?.to.Environment!,
            valueFilePath: props.promoteEnv?.to.ValueFilePath!,
            componentsToPromote: componentsToPromote
        }

        const response = await fetch("http://localhost:8080/promote", {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(appPromotion)
        });
        return response.json();
    }

    if (props.promoteEnv === undefined) {
        return (<div></div>);
    }

    return (
        <div>
            <div className="row" >
                <p>You will promote {props.promoteEnv?.project.Name} from {props.promoteEnv?.from.Environment} to {props.promoteEnv?.to.Environment}</p>
                <p>You can select the component you want to promote.</p>

                <div className="card-body">
                    <h6 className="card-title">To be deployed components</h6>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Current version</th>
                                <th scope="col">new version</th>
                            </tr>
                        </thead>
                        <tbody>
                            {componentPromotions.map(c => (
                                <tr>
                                    <th scope="row">{c.componentName}</th>
                                    <td><span className="badge badge-primary badge-pill">{c.oldVersion}</span></td>
                                    <td><span className="badge badge-success badge-pill">{c.newVersion}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
            <div className="row">
                <button type="button" className="btn btn-danger" onClick={startPromotion} >Yes, launch the promotion !</button>
            </div>

        </div>
    );
};


