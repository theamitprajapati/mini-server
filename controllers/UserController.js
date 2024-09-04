const { User, Realm, Token, Member } = require("../models");
const common = require("../utils/common");
const ArrUtils = require("../utils/arr");
const randomize = require("randomatic");
const openstackService = require("../services/openstack");
const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const mail = require("../utils/mail");

exports.usersList = async (req, res, next) => {
  let cnd = {};
  if (!req.user.is_superuser) {
    cnd.parentId = ObjectId(req.user._id);
  }
  try {
    let entries = await User.find(cnd).populate({
      path: "permission_group",
      select: "name",
    });
    res.reply({ data: entries });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  req.assert("first_name").notEmpty().isLength({ min: 3, max: 50 });
  req.assert("last_name").notEmpty().isLength({ min: 3, max: 50 });
  req.assert("phone").notEmpty().isMobilePhone();
  req.assert("company_name").notEmpty().isLength({ min: 3, max: 50 });
  req.assert("address").notEmpty().isLength({ min: 3, max: 100 });
  req.assert("pincode").notEmpty().isLength({ min: 5, max: 6 });
  req.assert("email").notEmpty().isLength({ min: 3 }).isEmail();
  req.assert("password").notEmpty().isLength({ min: 3, max: 100 });
  var errors = req.validationErrors();
  try {
    if (errors) {
      errors.data = ArrUtils.getFormatedError(errors);
      errors.status = 400;
      next(errors);
      return;
    }

    //let has_superuser = await User.findOne({ is_superuser: true });
    // if (!has_superuser) {
    //   req.body.is_superuser = true;
    //   let keyPair = await common.generateKeyPair();
    //   let realmCheck = await Realm.findOne();

    //   if (!realmCheck) {
    //     let realm = new Realm({
    //       public_key: keyPair.public,
    //       private_key: keyPair.private,
    //     });
    //     realm = await realm.save();
    //   }
    // }

    let tk = await Token.findOne({
      token: req.body.email,
      type: "email_verify_token",
      is_mail_verified: false,
    });

    let realmConfig = await Realm.findOne().then((e) => e.toJSON());
    if (realmConfig.default_permission_group) {
      req.body.permission_group = realmConfig.default_permission_group;
    }
    req.body.accountId = randomize("000000000000");
    req.body.parentId = req.params.id;
    let entry = new User(req.body);
    openstackService.createUser(req.body, async function (err, data) {
      if (err) return next(err);
      entry = await entry.save();
      res.reply({ data: entry, status: data });
    });
  } catch (err) {
    console.log(err);
    err.data = err.message;
    next(err);
  }
};

exports.profile = async (req, res, next) => {
  try {
    let userId = req.user._id;
    let entry = await User.findOne(
      { _id: userId },
      { _id: 0, meta: 0, is_superuser: 0 }
    ).populate({ path: "permission_group", select: "name" });
    if (!entry) throw { status: 404 };
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};

exports.details = async (req, res, next) => {
  try {
    let parentId = req.user.is_superuser ? "" : req.user._id;
    let userId = req.params.id;
    let cnd = { _id: userId };
    if (parentId) cnd["parentId"] = parentId;
    let entry = await User.findOne(cnd, {
      _id: 0,
      meta: 0,
      is_superuser: 0,
    }).populate({ path: "permission_group", select: "name" });
    if (!entry) throw { status: 404, message: "User not found !" };
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};

exports.updateDetails = async (req, res, next) => {
  try {
    let body = req.body;
    let userId = req.user.is_superuser ? req.params.id : req.user._id;
    if (!Object.keys(body).length)
      throw { status: 400, message: "body can not be empty" };
    // if (!req.user.is_superuser) req.body.is_superuser = false;
    let entry = await User.findOne({ _id: userId });
    if (!entry) throw { status: 404 };
    if (body.first_name) entry.first_name = body.first_name;
    if (body.last_name) entry.last_name = body.last_name;
    if (body.phone) entry.phone = body.phone;
    if (body.company_name) entry.company_name = body.company_name;
    if (body.address) entry.address = body.address;
    if (body.pincode) entry.pincode = body.pincode;
    if (body.is_2fa_enable == true || body.is_2fa_enable == false)
      entry["is_2fa_enable"] = body.is_2fa_enable;
    //if (body.permission_group && entry.is_superuser) //for admin only
    if (body.permission_group)
      entry.permission_group = ObjectId(body.permission_group);
    entry = await entry.save();
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let userId = req.user.is_superuser ? req.params.id : req.user._id;
    let entry = await User.findOne({ _id: userId });
    if (!entry) throw { status: 404 };
    entry = await entry.remove();
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  req.assert("old_password").notEmpty().isLength({ min: 6, max: 50 });
  req.assert("new_password").notEmpty().isLength({ min: 6, max: 50 });
  req.assert("confirm_password").notEmpty().isLength({ min: 6, max: 50 });
  var errors = req.validationErrors();
  try {
    if (errors) {
      throw {
        status: 400,
        data: ArrUtils.getFormatedError(errors),
        message: "Fields is required!",
      };
    }

    let userId = req.user.is_superuser ? req.params.id : req.user._id;
    let body = req.body;
    const entry = await User.findOne({ _id: userId });

    if (!Object.keys(entry).length)
      throw { status: 400, message: "User not found!" };

    if (body.new_password != body.confirm_password)
      throw {
        status: 400,
        message: "Password and confirm password not match!",
      };

    try {
      await entry.checkPassword(body.old_password);
    } catch (err) {
      throw { status: 400, message: "Invalid old password!" };
    }

    let response = await User.updateOne(
      { email: entry.email },
      { $set: { password: body.new_password } }
    );
    let msg = "Password Changed!";
    res.reply({ data: [], message: msg });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};


