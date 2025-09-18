

const express = require("express");
const routes = require("./routes/index")
const cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use('/api/v1', routes);

app.get("/", (req, res) => {
    console.log("server is running");
    res.send("server is running");

})

module.exports = app;