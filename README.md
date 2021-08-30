# Pulpomatic OpenAID
Application to get AID global information

## General folder structure
The general structure of the project
````
.
├── package.json
├── logs
├── node_modules
├── .gitignore
├── .env
├── .babelrc
├── .eslintrc.cjs
├── .env.example
└── src
    ├── app.js
    ├── index.js
    ├── components
    │   └── v1
    │       └── component
    |           ├── controllers
    |           ├── DAO
    │           ├── services
    │           ├── schemas
    │           └── router.js
    ├── configs
    │   └── index.js
    ├── db
    │   ├── mongoose.js
    │   └── redis.js
    ├── models
    │   └── entity.model.js
    ├── utils
        ├── middlewares
        └── libs

````

### API Documentation
- [Postman Public URL](https://documenter.getpostman.com/view/6889842/U16bvUBU)
- [Heroku Environment Path Base](https://pulpomatic-openaid.herokuapp.com)

### Code Style
The coding rules must be based on [ESLint recommendations](https://eslint.org/), [Clean code rules for Javascript](https://github.com/ryanmcdermott/clean-code-javascript) and [eslint-plugin-node](https://www.npmjs.com/package/eslint-plugin-node). In addition this project use **Airbnb** code rules.