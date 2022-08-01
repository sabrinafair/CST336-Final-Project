var express = require('express');
// var faker = require('@faker-js/faker');
var router = express.Router();


router.get('/',async function (req,res){
  res.render("testPage");
});

module.exports = router;