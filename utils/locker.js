var jwt = require('jsonwebtoken');
const common = require('./common');
const { Realm } = require('../config/models');
const ObjectId = require("mongoose").Types.ObjectId;

let data = {
  unlock: (required_scope = null) => async (request, response, next) => {

    try {
     

        

      let authHeader = request.headers['authorization'] || null;
      if (!authHeader && request.query['access_token']) {
        authHeader = 'Bearer ' + request.query['access_token'];
      }

      if(!authHeader) return next({status: 401,data:'Token is required'});

      if (typeof authHeader !== 'undefined' && authHeader.includes('Bearer ')) {
        authHeader = authHeader.substring(7);
        jwt.verify(authHeader, 'secret', async (err, decode) => {

            try {
 
              if (err) throw err;
              let authZ = false;
              if (required_scope && !decode.scopes.includes('zcs:admin')) {
                authZ = decode.scopes.includes(required_scope);
              } else {
                authZ = true;
              }
              if (!authZ) {
                return next({
                  status: 403,
                  data: {
                    message: `[SCOPE ERROR] - This route requires '${required_scope}' scope.`,
                  },
                });
              }
              request.token = authHeader;
              request.user = decode;
              request.isAdmin = decode?.is_superuser || false;

              console.log("IP:",request?.ip, " ","UserName: ",decode?.first_name,"userId:",decode._id)


              next();
            } catch (error) {
              response.reply({
                statusCode: error.statusCode || 401,
                data: error.message,
              });
            }
          }
        );
      } else {
        response.reply({ statusCode: 401});
      }
    } catch (err) {
      response.reply({ statusCode: err.status || 401,data:err.message });
    }
  },

  lock: async (payload, offline_flag = false) => {
   try{
    payload['iat'] = common.time();
    if (!offline_flag) payload['exp'] = common.time() + 60000;
    let token = jwt.sign(payload, 'secret');
    payload['access_token'] = token
    return payload;

   }catch(err){

     console.log("ERR>>>>>>>>",err)

   }
  },
};
module.exports = data;
