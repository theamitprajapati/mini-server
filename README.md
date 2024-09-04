# AuthDeputy
?amoq0q1xoH
### Controllers Name 

Controllers should be in PascalCase/CapitalCase like : `ArticleController` 

### Model Name 

Modeles should be singular like  `User`

### Router Name 

Routers name should be like: `permissions.js`,`users.js`


### Foreign key key or reference 

foreign key should be camelcase like: `userId`,`commentId`,`blogId`


### Modules

`Module in Node.js is a simple or complex functionality organized in single or multiple JavaScript files which can be reused throughout the Node.js application`


# Response should be this Format

## ERROR Response

```
{
    "status": false,
    "responseStatus": "UNAUTHORIZED",
    "message": "The client is not allowed to access resources, and should re-request with the required credentials.",
    "error": {}
}
```
## SUCCESS Response
```
{
    "status": true,
    "responseStatus": "OK",
    "message": "Request processed successfully.",
    "data": {
        "users": 1,
        "signups": 1
    }
}
```

## Mandate/mandatory  require Fields

![Alt text](image-1.png)

## Folder Structure

- apidocs
- bin
- config
- controllers
- middlewares
- models
- modules
- mongo_models
- public
- routes
- schedulers
- services
- utils
- views
- .env.sample
- gitignore
- README.md
- app.js
- package.json

![Alt text](image.png)