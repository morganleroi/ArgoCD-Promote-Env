Build image
```cmd
docker build -t argo-switch-env .
````

Run
```cmd
docker run -p 49245:8080 -d argo-switch-env
```

Test
```cmd
curl -i localhost:49245
```