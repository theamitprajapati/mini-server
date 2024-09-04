const { Permission, Scope ,User} = require("../config/models");

const seedData = {
  permission: { admin: { name: "authdeputy_admin" }, basic: { name: "basic" } },
  scopes: [
    { name: "user_read",description: "user_read" },
    { name: "user_write",description: "user_write" },
    { name: "scope_read" ,description: "scope_read"},
    { name: "scope_write" ,description: "scope_write"},
    { name: "role_read" ,description: "role_read"},
    { name: "role_write" ,description: "role_write"}
  ],
  users:[{name:"Admin",username:"admin",password:"admin"},{name:"Demo",username:"demo",password:"demo"}]
};
module.exports = async () => {
  let entry;

  entry = await Permission.findOne(seedData.permission.admin);
  if (!entry) {
    await Scope.deleteMany({
      name: { $in: seedData.scopes.map(e => e.name) }
    });
    entry = await Scope.insertMany(seedData.scopes);
    seedData.permission.admin.scopes = entry.map(e => e._id);
    entry = await Permission.insertMany(
      Object.entries(seedData.permission).map(([key, value]) => value)
    );
  }
};
