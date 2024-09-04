const Permission=require('../models/Permission')
exports.permission = async (req, res, next) => {
  try {
    let entries = await Permission.find().populate("scopes");
    res.reply({ data: entries });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};
exports.getPermission = async (req, res, next) => {
  try {
    let entry = await Permission.findOne({ _id: req.params.id }).populate(
      "scopes"
    );
    if (!entry) throw { status: 404 };
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};

exports.addPermission = async (req, res, next) => {
  try {
    let entry = new Permission(req.body);
    entry = await entry.save();
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};
exports.setPermission = async (req, res, next) => {
  try {
    let entry = await Permission.findOne({ _id: req.params.id });
    if (!entry) throw { status: 404 };
    entry.name = req.body.name;
    entry.description = req.body.description;
    entry.scopes = req.body.scopes;
    entry = await entry.save();
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};
exports.delete = async (req, res, next) => {
  try {
    let entry = await Permission.findOne({ _id: req.params.id });
    if (!entry) throw { status: 404 };
    entry = await entry.remove();
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};
