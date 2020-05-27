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

export const PromoteEnvViewer = (props: { promoteEnv: PromoteEnv | undefined, components: ComponentApp[] | undefined }) => {

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
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(appPromotion) // body data type must match "Content-Type" header
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

            </div>
            <div className="row">
                <button type="button" className="btn btn-danger" onClick={startPromotion} >Yes, launch the promotion !</button>
            </div>

        </div>
    );
};


