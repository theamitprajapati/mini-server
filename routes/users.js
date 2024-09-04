const express = require("express");
const router = express.Router();
const locker = require("../utils/locker");
const Home = require("../controllers/HomeController");
const User = require("../controllers/UserController");

router.get("/list", User.usersList);

router.post("/create/:id", locker.unlock("user:create"), User.createUser);

//get profile
router.get("/profile/:id", locker.unlock("user:profile"), User.profile);

//get user details
router.get("/details/:id", User.details);

//update profile
router.put("/profile/:id", locker.unlock("user:update"), User.updateDetails);

//delete profile
router.delete("/:id", locker.unlock("user:delete"), User.deleteUser);

//changepassword
router.post(
  "/change-password/:id",
  locker.unlock("user:change-password"),
  User.changePassword
);

// user Last login
router.get("/last-login/:id", User.lastLogin);

//assign project to member
router.post(
  "/add_member/:id",
  locker.unlock("user:create"),
  User.addMemberInProject
);
router.post(
  "/add_self_member/:id",
  locker.unlock("user:create"),
  User.addSelfMemberInProject
);
router.get("/member_list", User.memberList);

module.exports = router;
