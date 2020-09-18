# node-red-contrib-auth-mongodb

This is an authentication plugin for Node-RED that uses MongoDB as the backend

## Setup

You need to add the following to `settings.js`

```
adminAuth: require('node-red-contrib-auth-mongodb').setup({
  mongoURI: "mongodb://mongo.exmample.com/nodered",
  appname: "foo"
})
```

Where `mongoURI` is the location of a MongoDB database and `appname` is a unique identifier for this instance of Node-RED to allow multiple instances to use the same DB.

It will use a collection called `users` in the datase.

For an example of how to create user entries in the collection look at `test.js`