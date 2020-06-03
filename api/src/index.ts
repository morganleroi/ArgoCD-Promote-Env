import express, { NextFunction, Request, Response } from "express"
import { getNamespaces, getPodsInNamespace } from './kube'
import { SOTW } from './server'
import { writeValuesFiles } from "./parser";
import { createPromotionCommit } from "./git";
import bodyParser from 'body-parser'

export const app = express();

var cors = require('cors');

app.use(cors());
app.use(bodyParser.json())

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json(SOTW);
});

app.post("/promote", (req: Request, res: Response, next: NextFunction) => {
    const appPromotion = req.body;
    console.log(appPromotion);
    console.log("Writing values files")
    writeValuesFiles(appPromotion);
    console.log("Commit ...")
    createPromotionCommit(appPromotion).then(() => console.log("Done"));
    
    res.statusCode = 201;
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

