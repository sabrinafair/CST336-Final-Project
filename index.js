const express = require("express");
const session = require('express-session');
const fileUpload = require('express-fileupload');
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(session({
  secret: "OtterSecret!",
  resave: true,
  saveUninitialized: true
}));

const categoryRouter = require('./routes/category');
const userRouter = require('./routes/user');
const apiRouter = require('./routes/api');
const testRouter = require('./routes/test');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const homeRouter = require('./routes/home');
app.use('/cat', categoryRouter);
app.use('/user', userRouter);
app.use('/api', apiRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/test', testRouter);
app.use('/home', homeRouter);

//routes
app.get('/', (req, res) => {
  // res.redirect('/test');
  //Will change, defaults to tests for now...
  res.redirect('/home');
});

app.listen(3000, () => {
  console.log("Expresss server running...");
});
