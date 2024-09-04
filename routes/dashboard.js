var express = require("express");
var router = express.Router();
const locker = require("../utils/locker");
const Dashboard = require("../controllers/DashboardController");

router.get("/", Dashboard.dashboard);
router.get("/overview", Dashboard.overview);
module.exports = router;
