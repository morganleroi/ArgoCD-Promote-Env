
export const getState = () => {
    return StateOfTheWorld;
}

const StateOfTheWorld = {
    Apps: [{
        Name: "App1",
        Envs: [{
            Name: "Dev",
            Components: [{
                Name: "Backend1",
                DeployedVersion: "0.0.5"
            }, {
                Name: "Backend2",
                DeployedVersion: "1.0.1"
            }]
        }, {
            Name: "Prod",
            Components: [{
                Name: "Backend1",
                DeployedVersion: "0.0.1"
            }, {
                Name: "Backend2",
                DeployedVersion: "1.0.0"
            }]
        }]
    }, {
        Name: "App2",
        Envs: [{
            Name: "Dev",
            Components: [{
                Name: "Backend1",
                DeployedVersion: "0.0.5"
            }, {
                Name: "Backend2",
                DeployedVersion: "1.0.1"
            }]
        }, {
            Name: "Prod",
            Components: [{
                Name: "Backend1",
                DeployedVersion: "0.0.1"
            }, {
                Name: "Backend2",
                DeployedVersion: "1.0.0"
            }]
        }]
    }]
};