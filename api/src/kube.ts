import * as k8s from '@kubernetes/client-node'

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sClient = kc.makeApiClient(k8s.CoreV1Api);

export const getNamespaces = () => k8sClient.listNamespace()
    .then((res) => {
        return res.body.items.map(e => e.metadata?.name);
    });

export const getPodsInNamespace = (namespace: string) => k8sClient.listNamespacedPod(namespace)
    .then((res) => {
        return res.body.items.map(e => e.metadata?.name);
    });