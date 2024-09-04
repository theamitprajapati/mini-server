const Scope=require('../models/Scope')
exports.scope = async (req, res, next) => {
  try {
    console.log("Realm", req.params);
    let _scopes = await Scope.find();
    res.reply({ data: _scopes });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
}

exports.getScope = async (req, res, next) => {
  try {
    let _scope = await Scope.findOne({ _id: req.params.id });
    if (!_scope) throw { status: 404 };
    res.reply({ data: _scope });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
}
exports.addScope = async (req, res, next) => {
  try {
    let _scope = new Scope(req.body);
    _scope = await _scope.save();
    res.reply({ data: _scope });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
}
exports.setScope = async (req, res, next) => {
  try {
    let _scope = await Scope.findOne({ _id: req.params.id });
    if (!_scope) throw { status: 404 };
    _scope.name = req.body.name;
    _scope.description = req.body.description;
    _scope = await _scope.save();
    res.reply({ data: _scope });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
}

exports.delete = async (req, res, next) => {
  try {
    let _scope = await Scope.findOne({ _id: req.params.id });
    if (!_scope) throw { status: 404 };
    _scope = await _scope.remove();
    res.reply({ data: _scope });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
}