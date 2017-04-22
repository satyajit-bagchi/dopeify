// dopfiy.js
'use strict';

// Requirements
var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
var admin = require('firebase-admin');
var firebase = require('firebase');
// Init
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));

var port = process.env.PORT || 8000;


//Firebasey stuff
var serviceAccount = require("./dopify-firedb-firebase-adminsdk-5sqig-93ef844d5e.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dopify-firedb.firebaseio.com"
});

var db = admin.database();
var ref = db.ref();

var config = {
  apiKey: "AIzaSyBJR3_4kOR4e68d6WI6rdV2tlgCmnfHsQU",
  authDomain: "dopify-firedb.firebaseapp.com",
  databaseURL: "https://dopify-firedb.firebaseio.com",
  projectId: "dopify-firedb",
  storageBucket: "dopify-firedb.appspot.com",
  messagingSenderId: "98312933889"
};
firebase.initializeApp(config);


app.listen(port, function() {
  console.log('Web server listening on port 8000!');
});
/*
ref.push({task: 'Make cool shit', owner:'Satya'});
ref.push({task: 'Take over the world', owner:'Satya'});
ref.push({task: 'Fight off cold', owner:'Somshree'});
ref.push({task: 'Learn to take quick showers', owner:'Somshree'});
*/
app.get('/', function(req, res) {
  ref.once("value", function(snapshot) {
    var task_list = snapshot.val();
    var task_keys = Object.keys(task_list);
    //console.log(task_list);
    res.render('main-page', {
      tasks: task_list,
      keys: task_keys
    });
  }, function(errorObject) {
    console.log(errorObject)
  });
});

function gotData(data) {
  //console.log(data.val());
  var tasks = data.val();
  var keys = Object.keys(tasks);
  //console.log(keys);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var task = tasks[k].task;
    console.log(task);
  }
}

function errData(data) {
  console.log(err);
}
app.post('/tasks/create', function(req, res) {
  var db = admin.database();
  var ref = db.ref();

  var body = req.body.task;
  var handle = 'Satya';
  console.log(body);
  console.log(ref);

  ref.push({
    task: body,
    owner: handle
  });
  res.redirect('/');
});


app.get('/tasks/:id/delete', function(req, res) {
  var key = req.params.id;
  ref.child(key).remove().then(function() {
    console.log('Removed item');
  });
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup-page');
})
app.get('/login', function(req, res) {
  res.render('login-page');
})

app.post('/signup/new', function(req, res) {
  var uname = req.body.signup_username;
  var pwd = req.body.signup_password;
  console.log(uname);
  firebase.auth().createUserWithEmailAndPassword({
    email: uname,
    password: pwd
  },function(error, userData) {

		callback(error, userData.uid);

	});

  res.redirect('/');

})

app.get('/about', function(req, res){
  res.render('about');
})

app.post('/login', function(req, res) {
  var email = req.body.login_username;
  var password = req.body.login_password;
  console.log(email);

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    // ...
  });
  var action = 'Login';
  var action_string = 'Logged in';
  res.render('tmp_testing_page', {action: action, action_string: action_string});
});

app.get('/logout', function(req, res) {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
    console.log(error);
  });
  var action = 'Logout';
  var action_string = 'logged out';
  res.render('tmp_testing_page', {action: action, action_string: action_string});
  setTimeout(wait_helper, 2000);
  res.redirect('/');
});

function wait_helper()
{
  console.log('Waiting');
}

/*
ref.set({
    1: {task: 'Make cool shit', owner:'Satya'},
    2: {task: 'Take over the world', owner:'Satya'},
    3:{task: 'Fight off cold', owner:'Somshree'},
    4:{task: 'Learn to take quick showers', owner:'Somshree'}
});
*/
