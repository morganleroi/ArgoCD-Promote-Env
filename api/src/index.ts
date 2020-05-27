import express, { NextFunction, Request, Response } from "express"
import { getNamespaces, getPodsInNamespace } from './kube'
import { getState } from './applications'
import { SOTW } from './server'
import { writeValuesFiles } from "./parser";
import { createPromotionCommit } from "./git";
import bodyParser from 'body-parser'
import { AppsV1beta1RollingUpdateDeployment } from "@kubernetes/client-node";

export const app = express();

var cors = require('cors');

app.use(cors());
app.use(bodyParser.json())

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json(SOTW);
});

app.post("/promote", (req: Request, res: Response, next: NextFunction) => {
    const promotionEnv = {
        projectName: "MySecondApp",
        fromEnv: 'devci',
        toEnv: 'prd',
        valueFilePath: "prd/values.yaml",
        componentsToPromote: [{
            componentName: "MyFirstComponent",
            newVersion: "0.1.2.3.4"
        }, {
            componentName: "MySecondComponent",
            newVersion: "5.6.7.8"
        }, {
            componentName: "MyThirdComponent",
            newVersion: "9.10.11.12"
        }]
    };
    const appPromotion = req.body;
    console.log(appPromotion);
    console.log("Writing values files")
    writeValuesFiles("repo", appPromotion);
    console.log("Commit ...")
    createPromotionCommit(appPromotion).then(() => console.log("Done"));
    
    res.statusCode = 201;
});

app.get("/state", (req: Request, res: Response, next: NextFunction) => {
    res.json(getState());
});

app.get("/namespaces", (req: Request, res: Response, next: NextFunction) => {
    getNamespaces().then(namespaces => {
        res.json(namespaces);
    });
});

app.get("/pods/:namespace", (req: Request, res: Response, next: NextFunction) => {
    getPodsInNamespace(req.params.namespace).then(pods => {
        res.json(pods);
    })
});

