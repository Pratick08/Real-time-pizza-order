require("dotenv").config();
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path")
const PORT = 3000;
const mongoose = require("mongoose");
const session=require("express-session");
const flash = require("express-flash");
const MongoDbStore=require("connect-mongo")(session);
const passport=require("passport");
// ***************database connection*************
mongoose.connect("mongodb://127.0.0.1:27017/pizza")
.then( ()=>console.log("Database Connected...")).catch((err)=>console.log("Connection Failed"));

// session store 
let mongoStore = new MongoDbStore({
    mongooseConnection: mongoose.connection,
    collection:"sessions"
})

// Session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24}
}))
app.use(flash());
// passport config
const passportInit=require("./app/config/passport")
passportInit(passport);
app.use(passport.initialize())
app.use(passport.session())
//static folders
const templatepath = path.join(__dirname, "./templatepath/views")
const partial_path = path.join(__dirname, "./templatepath/partialpath")
const publicPath = path.join(__dirname, "/public");
const template=path.join(__dirname,"./templatepath");
// Global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session; 
    res.locals.user=req.user
    next();
})
app.use(express.json());
app.use(express.urlencoded({extended:false}))
// static folders
app.use(express.static(publicPath));
app.use(express.static(templatepath));
app.use(express.static(template));
hbs.registerPartials(partial_path);
// set view engine
app.set("view engine", "hbs");
app.set("views", templatepath);

// Register a custom Handlebars helper
hbs.registerHelper('multiply', function(a, b) {
    return a * b;
});
hbs.registerHelper('add', function(x, y) {
    return x + y;
});
hbs.registerHelper('ifEqual',function(arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
  })

// *****************routing***************
require('./routes/web')(app);
app.listen(PORT, () => {
    console.log(`listning on port ${PORT}`);
})