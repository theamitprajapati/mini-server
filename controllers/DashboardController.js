const User = require("../models/User");
const common = require("../utils/common");
const  {ObjectId} = require("mongodb")
const _ENV = process.env;


exports.dashboard = async (req, res, next) => {
  try {

    let users = '0';
    if(req.user.is_superuser){
       users = await User.countDocuments();
    }else{
       users = await User.countDocuments({ parentId: ObjectId(req.user._id) });
    }

    let signups = await User.countDocuments({
      parentId: null,
    });
    res.reply({ data: { users, signups } });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    let realm = await Realm.findOne().then((e) => e.toJSON());
    delete realm["private_key"];
    res.reply({ data: realm });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
};

exports.overview = async (req, res, next) => {
  try{
    const token = req?.token;
    const project_id=req.openstack.project.id;
    const neutron = new openstack.Neutron(_ENV.OS_NEUTRON_URL, token);
    var nova = new openstack.Nova(_ENV.OS_NOVA_URL, token);
    const cinder = new openstack.Cinder(_ENV.OS_NEUTRON_URL);
    cinder.token = token;

    const instance = await new Promise((resolve, reject) => {
      nova.limits(function(error, limit) {
          if (error) {
              resolve(null);
          } else {
              resolve(limit);
          }
      });
    });

    
    const network = await new Promise((resolve, reject) => {
      neutron.limits(project_id,function(error, limit) {
          if (error) {
              resolve(null);
          } else {
              resolve(limit);
          }
      });
    });

    const volume = await new Promise((resolve, reject) => {
      cinder.limits(function(error, limit) {
          if (error) {
              resolve(null);
          } else {
              resolve(limit);
          }
      });
    });

    res.reply({data:{instance,network,volume}})
  }catch (err) {
    next(err)
  }
}
