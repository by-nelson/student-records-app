import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { findAll, create, findOne, update, remove} from "./app/controller/supplier.controller.js";

const app = express();
import mustacheExpress from "mustache-express";
import favicon from 'serve-favicon';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.options("*", cors());
app.engine("html", mustacheExpress())
app.set("view engine", "html")
app.set("views", __dirname + "/views")
app.use(express.static('public'));
app.use(favicon(__dirname + "/public/img/favicon.ico"));

// list all the students
app.get("/", (req, res) => {
    res.render("home", {});
});
app.get("/students/", findAll);
// show the add suppler form
app.get("/supplier-add", (req, res) => {
    res.render("supplier-add", {});
});
// receive the add supplier POST
app.post("/supplier-add", create);
// show the update form
app.get("/supplier-update/:id", findOne);
// receive the update POST
app.post("/supplier-update", update);
// receive the POST to delete a supplier
app.post("/supplier-remove/:id", remove);
// handle 404
app.use(function (req, res, next) {
    res.status(404).render("404", {});
})


// set port, listen for requests
const app_port = process.env.APP_PORT ||3000
app.listen(app_port, () => {
    console.log(`Server is running on port ${app_port}.`);
});
