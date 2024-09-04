const role_operation = require('../services/RoleDb');
exports.getAllroles = async (req, res,next) => {
  try {
    const roleNames = req.query?.role_name || "";
    // if (!roleNames) {
    //   return res.status(400).json({ error: 'role_name parameter is required' });
    // }
    const roleNamesArray = roleNames?.split(',').map(e => e.toLowerCase()).filter(e => e && e != '');
    const data = await role_operation.getroles(roleNamesArray);
    return res.reply({ data: data });

  } catch (err) {
     console.log("Err",err)
    next(err);
  }
};
exports.createrole = async (req, res,next) => {
  try {
    let role_name = req.body.role_name
    let role_action = req.body.role_action || [];
    const existing_role = await role_operation.find(role_name)
    if (existing_role) {
      res.send({data: "Conflict - The role_name already exists." });
      console.log("if")
    } else {
      console.log("else")
      const result = await role_operation.createrole(role_name, role_action);
      res.reply({ data: result });
    }

  } catch (err) {
     console.log("Err",err)
    next(err);
  }
};
exports.updaterole = async (req, res,next) => {
  try {
    let role_name = req.body.role_name
    let role_action = req.body.role_action || [];
    const data = await role_operation.upsertrole(role_name, role_action);
    return res.reply({ data: data })
  } catch (err) {
    next(err);
  }
};
exports.deleterole = async (req, res) => {
  try {
    let role_name = req.params?.role_name || ""
    role_name = role_name.toLowerCase()
    const data = await role_operation.deleterole(role_name);
    return res.reply({ data:data });
  } catch (err) {
     console.log("Err",err)
    next(err);
  }
};