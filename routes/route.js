// Declare all routes in rote config file

const path = require("path");
// const usersRouter = require("./users");
const authRouter = require("./auth");
const dashboardRouter = require("./dashboard");
const locker = require("../utils/locker");


module.exports = (app) => {
  //General Routers
  app.use("/api/auth/",authRouter);
  app.use("/api/dashboard",[locker.unlock()], dashboardRouter);
};
