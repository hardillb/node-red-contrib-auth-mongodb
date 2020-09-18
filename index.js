const mongoose = require('mongoose');

const Users = require('./models/users');

var mongoose_options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

var appname

module.exports = {
  type: "credentials",
  setup: function(settings) {
    if (settings && settings.mongoURI) {
      appname = settings.appname;
      mongoose.connect(settings.mongoURI, mongoose_options)
      .then(() => {
      })
      .catch(err => {
        throw err;
      });
    }
    return this;
  },
  users: function(username) {
    return new Promise(function (resolve, reject){
      Users.findOne({appname: appname, username: username}, {username: 1, permissions: 1})
      .then(user => {
        resolve(user);
      })
    });
  },
  authenticate: function(username, password) {
      return new Promise(function(resolve, reject){
        Users.findOne({appname: appname, username})
        .then((user) => {
          user.authenticate(password, function(e,u,pe){
            if (u) {
              resolve(u)
            } else {
              resolve(null);
            }
          })
        })
      }) 
  },
  default: function() {
    return Promise.resolve(null);
  }
}