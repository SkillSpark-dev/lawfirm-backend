const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");
const app = express();

// ✅ Configure CORS explicitly
app.use(
  cors({
    origin: ["http://localhost:3000", "https://lawfirm-frontend-hazel.vercel.app"], // allow local & deployed frontend
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if using cookies/auth headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  console.log("server is running");
  res.send("server is running");
});

module.exports = app;
