const { User, Realm, Scope, Token} = require("../models");
const locker = require("../utils/locker");





exports.login = async function (req, res, next) {

  console.log("XXXXXXXXXXXXXXXXXXX")
  req.assert("username").notEmpty().isLength({ min: 3, max: 50 });
  req.assert("password").notEmpty().isLength({ min: 4, max: 50 });
  var errors = req.validationErrors();
  try {
    if (errors) throw { status: 400, data: errors };
    let msg = "Invalid username Or password"
    let _user = await User.findOne({username:req.body.username}).populate({
      path: "permission_group",
      select: ["name"],
      populate: {
        path: "scopes",
        model: "Scope",
      },
    });

    if (!_user) throw { status: 400,message:msg };
    console.log("DDDDDDDDDDDDDD")
    let authUser = await _user.checkPassword(req.body.password);

    if (!authUser) throw { status: 400,message:msg };

    authUser = authUser.toJSON();
    authUser["scopes"] = authUser.permission_group
      ? authUser.permission_group.scopes.map((e) => e.name)
      : "";

    if (!authUser.permission_group)
      throw { status: 403, data: "Role not assigned!" };

    delete authUser["permission_group"]["scopes"];
    delete authUser["createdAt"];
    delete authUser["updatedAt"];
    delete authUser["source"];
    delete authUser["__v"];

    if (authUser.is_superuser) {
      try {
        authUser.scopes = authUser.scopes.filter((e) => e !== "");
      } catch (err) {
        authUser.scopes = [];
      }
      // authUser.scopes.push("zcs:admin");
      authUser.scopes.push("authdeputy:admin");
    }
    let access_mode = req.query.access_mode;
    let flagMode =
      access_mode && access_mode === "offline_access" ? true : false;
    let user = await locker.lock(authUser, flagMode);

    res.reply({ data: {...user} });
  } catch (err) {
    console.error("Login ERR:", err);
    next(err);
  }
};



exports.logout= async function (req, res, next) {
  try {   
    let username=req.params.username;
    Zcloud_token.deleteMany({username:username}).then(()=>{
      res.reply({ data: "logout" });
    })
  } catch (err) {
    next(err);
  }
};


