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
    componentType: string;
};

type ComponentPromotionViewer = {
    componentName: string;
    oldVersion?: string;
    newVersion?: string;
    isSameVersion: boolean
}

export const PromoteEnvViewer = (props: { promoteEnv: PromoteEnv | undefined, components: ComponentApp[] | undefined }) => {


    const fromEnvComponents = props.components?.filter(c => c.App === props.promoteEnv?.from.Name);
    const toEnvComponents = props.components?.filter(c => c.App === props.promoteEnv?.to.Name);

    const componentPromotions: ComponentPromotionViewer[] = [];
    fromEnvComponents?.forEach(c => {
        const oldComponent = toEnvComponents?.find(oldComponent => oldComponent.Name === c.Name);
        const newVersion = c.DeployedVersion.split(':').pop();
        const oldVersion = oldComponent?.DeployedVersion.split(':').pop();

        componentPromotions.push({
            componentName: c.Name,
            newVersion: newVersion,
            oldVersion: oldVersion,
            isSameVersion: newVersion === oldVersion
        })
    });

    async function startPromotion() {

        const componentsToPromote: ComponentToPromote[] = [];
        const fromEnvComponents = props.components?.filter(c => c.App === props.promoteEnv?.from.Name);
        fromEnvComponents?.forEach(x => componentsToPromote.push({
            componentName: x.Name,
            newVersion: x.DeployedVersion,
            componentType: x.ComponentType,
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
        <div className="row mt-1" >
            <div className="col-sm-12">
                <div className="card" >
                    <h5 className="card-header">
                        You will promote {props.promoteEnv?.project.Name} from {props.promoteEnv?.from.Environment} to {props.promoteEnv?.to.Environment}
                    </h5>
                    <div className="card-body">
                        <h6 className="card-title"></h6>
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
                                        <td><span className={c.isSameVersion ? "badge badge-primary badge-pill" : "badge badge-success badge-pill"} >{c.newVersion}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="row justify-content-end">
                            {componentPromotions.some(c => !c.isSameVersion) ?
                                <button type="button" className="btn btn-danger" onClick={startPromotion} >Yes, launch the promotion !</button> : <div>Nothing to promote</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


