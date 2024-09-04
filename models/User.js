const mongoose = require("mongoose");
const { isEmail } = require("validator");
const common = require("../utils/common");

const sources = {
  EMAIL: "email",
  GITHUB: "github"
};

var userSchema = new mongoose.Schema(
  {
    name:{type: String},
    username:{type: String,required: true},
    password: { type: String, required: true, set: common.hash },
    permission_group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission"
    },
    meta:{}
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.methods.checkPassword = async function(password) {
  if (common.hash(password) === this.password) {
    return this;
  }
  throw { status: 400,message:"Invalid username or password" };
};

module.exports = mongoose.model("User", userSchema);






