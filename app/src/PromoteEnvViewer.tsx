import React from "react";
import { AppProject, Project } from "./StateOfTheWorld";

export type PromoteEnv = {
    project: Project,
    from: AppProject,
    to: AppProject
}

export const PromoteEnvViewer = (props: { promoteEnv: PromoteEnv | undefined, components: any[] | undefined }) => {

    async function startPromotion() {
        const response = await fetch("http://localhost:49245/promote", {
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
            body: JSON.stringify(props.promoteEnv) // body data type must match "Content-Type" header
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


