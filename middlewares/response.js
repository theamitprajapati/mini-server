module.exports = function (req, res, next) {
  res.reply = (responseJson) => {
    

    console.log({responseJson})
    let data =
      typeof responseJson.data === "undefined" ? {} : responseJson.data;
    let statusCode =
      typeof responseJson.statusCode === "undefined"
        ? 200
        : responseJson.statusCode || 500;
    let message = responseJson.message;
   
    let status = statusCode == 200?false:true;

    let result = {
      error: status,
      message: message,
    };

    return res.status(statusCode).send({ ...result, error: status, data: data });
  };
  next();
};
