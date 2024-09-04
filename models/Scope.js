const mongoose = require("mongoose");
const { slug } = require("../utils/common");

var scopeSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
      index: { unique: true },
      lowercase: true,
      set: slug
    },
    type: {
      type: String,
     // required: true
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    description: {
      type: String,
     // required: true
    }
  },
  {
    timestamps: true,
    strict: true
  }
);

scopeSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Scope", scopeSchema);
