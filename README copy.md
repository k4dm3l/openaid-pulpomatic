# Rolesy.io
Application to managment recruitment process

## General folder structure
The general structure of the project
````
.
├── package.json
├── .gitignore
├── .env
├── .env.example
└── src
    ├── app.js
    ├── index.js
    ├── components
    │   └── new-component
    │       ├── controllers
    │       ├── services
    │       ├── schemas
    │       └── new-component.router.js
    ├── configs
    │   └── index.js
    ├── databases
    │   ├── mongoose.js
    │   └── sequelize.js
    ├── models
    │   └── entity.model.js
    ├── providers
    ├── utils
    │   ├── middlewares
    │   ├── mocks
    │   └── libs
    └── routers
        └── main.router.js

````

### Code Style
The coding rules must be based on [ESLint recommendations](https://eslint.org/), [Clean code rules for Javascript](https://github.com/ryanmcdermott/clean-code-javascript) and [eslint-plugin-node](https://www.npmjs.com/package/eslint-plugin-node). In addition this project use **Airbnb** code rules.