var express       = require('express');
var expressValidator = require('express-validator')
const cors =   require("cors")
const morgan = require('morgan');

//direct config required
require("dotenv").config();
require("./config/db");

var app = express();
require("./utils/default.seed")();


//middleware required here
app.use(morgan("dev"));
app.use(express.json());
app.use(require("./middlewares/response"));

app.use(cors({origin:'*' }));

app.use(expressValidator())


// Routes
const routes      = require("./routes/route");
routes(app);



// error handler
app.use(function (err, req, res, next) {
   let message = err?.message || err?.data
  res.reply({ statusCode: err.status || 500,message});
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.reply({ statusCode: 404 });
});

module.exports = app;



