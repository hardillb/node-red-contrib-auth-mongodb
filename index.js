const mongoose = require('mongoose');

const Users = require('./models/users');

var mongoose_options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

var appname

module.exports = {
  type: "credentials",
  setup: function(settings) {
    if (settings && settings.mongoURI) {
      appname = settings.appname;
      mongoose.connect(settings.mongoURI, mongoose_options)
      .then(() => {
        //console.log("connected to auth db");
      })
      .catch(err => {
        throw err;
      });
    }
    return this;
  },
  users: function(username) {
    // console.log("looking for " + username);
    return new Promise(function (resolve, reject){
      Users.findOne({appname: appname, username: username}, {username: 1, permissions: 1})
      .then(user => {
        // console.log("user lookup found ");
        resolve({username: user.username, permissions: user.permissions});
      })
      .catch(err => {
        reject(err);
      })
    });
  },
  authenticate: function(username, password) {
    // console.log("auth for " + username);
      return new Promise(function(resolve, reject){
        Users.findOne({appname: appname, username: username})
        .then( (userObj) => {
          if(userObj) {
            userObj.authenticate(password)
            .then( ({user}) => {  
              if (user) {
                // console.log("auth good");
                resolve({username: user.username, permissions: user.permissions});
              } else {
                // console.log("auth failed")
                resolve(null);
              }
            })
          } else {
            resolve(null);
          }
        })
        .catch(err => {
          reject(err);
        })
      }) 
  },
  default: function() {
    // console.log("default");
    return Promise.resolve(null);
  }
}