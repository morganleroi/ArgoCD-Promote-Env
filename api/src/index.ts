import express, { NextFunction, Request, Response } from "express"
import { getNamespaces, getPodsInNamespace } from './kube'
import { getState } from './applications'
import { SOTW } from './server'

export const app = express();

var cors = require('cors');

app.use(cors());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json(SOTW);
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

