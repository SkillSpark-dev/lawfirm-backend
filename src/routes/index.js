const express = require("express");
const router = express.Router();
const userROuter = require("./user.route");
const aboutRouter = require("./about.route");
const servicesRouter = require("./services.route");
const insightRouter = require("./insight.route");
const teamRouter = require("./team.route");
const contactRouter = require("./contact.route");
const homeRouter = require("./home.route");
const infoRouter = require("./info.route");
const reviewRouter = require("./review.route");

const appointmentRouter = require("./appointment.route");
const navbarRouter = require("./navbar.route");

const defaultRoutess =[
    {
        path:"/user",
        router:userROuter
    },
    {
        path:"/about",
        router:aboutRouter
    },
    {
        path:"/services",
        router:servicesRouter
    },
    {
        path:"/insight",
        router:insightRouter
    },
    {
        path:"/team",
        router:teamRouter
    },
    {
        path:"/contact",
        router:contactRouter
    },
    {
        path:"/home",
        router:homeRouter
    },
    {
        path:"/info",
        router:infoRouter
    },
    {
        path:"/review",
        router:reviewRouter
    },
  
    {
        path:"/appointment",
        router:appointmentRouter
    },
    {
        path:"/navbar",
        router:navbarRouter
    }
]
defaultRoutess.forEach(route => {
  if (typeof route.router !== "function" && typeof route.router?.use !== "function") {
    console.error(`❌ ${route.path} is not a valid router. Got:`, route.router);
  } else {
    console.log(`✅ ${route.path} router loaded`);
    router.use(route.path, route.router);
  }
});

module.exports = router;