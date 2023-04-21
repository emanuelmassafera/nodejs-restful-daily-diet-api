[![Node.js CI](https://github.com/emanuelmassafera/nodejs-restful-daily-diet-api/actions/workflows/node.js.yml/badge.svg)](https://github.com/emanuelmassafera/nodejs-restful-daily-diet-api/actions/workflows/node.js.yml)

<h1 align="center">Node.js RESTful Daily Diet API</h1>

<p align="center">A simple RESTful API designed to reinforce Node.js concepts</p>

---

### About

This repository was designed to reinforce Node.js concepts. The idea was to create a simple RESTful API using TypeScript. 

---

### Features

- Create a user
- Create a meal
- List all meals
- Get a meal by id
- Delete a meal
- Update a meal
- Get a summary

---

### How to run

#### Prerequisites

Before starting, you will need to have the following tools installed on your machine: [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/). The application is using tools from the latest versions of Node.js.

It will also be necessary to create a .env file. You should check the [.env.template](https://github.com/emanuelmassafera/nodejs-restful-daily-diet-api/blob/main/.env.example).

#### Running the application

```bash
# Clone this repository
$ git clone https://github.com/emanuelmassafera/nodejs-restful-daily-diet-api.git

# Access the project folder via the terminal/cmd
$ cd nodejs-restful-daily-diet-api

# Install dependencies
$ npm install

# Run the migrations
$ npm run knex -- migrate:latest

# Run the server
$ npm run dev

# The server will start at port:3333
```

---

### Author

<img style="border-radius: 50%;" src="https://avatars1.githubusercontent.com/u/65625500?s=460&u=eb9e300de61698fc8531949a451ce2f0e9da46f9&v=4" width="100px;" alt=""/>
<sub>Emanuel Massafera</sub>

<b></b>

[![Badge](https://img.shields.io/static/v1?label=&message=Emanuel&color=blue&style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/emanuelmassafera/)](https://www.linkedin.com/in/emanuelmassafera/) [![Badge](https://img.shields.io/static/v1?label=&message=emanuel301@live.com&color=0078D4&style=flat-square&logo=Microsoft-Outlook&logoColor=white&link=mailto:emanuel301@live.com)](mailto:emanuel301@live.com)

---

## License

This repository is licensed by **MIT LICENSE**. For detailed information, read the file [LICENSE](https://github.com/emanuelmassafera/nodejs-restful-daily-diet-api/blob/main/LICENSE). 

Made with ♥ by Emanuel Massafera :wave: [Get in touch!](https://www.linkedin.com/in/emanuelmassafera/)
