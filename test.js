const mongoose = require('mongoose');

const Users = require('./models/users');

var mongoose_options = {
	useNewUrlParser: true,
	useUnifiedTopology: true
};

mongoose.connect("mongodb://localhost:27017/nodered", mongoose_options)
.then(async () => {
	var u = new Users({
		appname: "r1",
		username: "admin",
		email: "foo@example.com",
		permissions: "*"
	})

	await u.setPassword("password")
	await u.save()
	
	Users.authenticate()("admin", "password")
	.then((user) => {
		console.log("authenticated");
		console.log(user)

	})
	.catch( err => {
		console.log(err);
	})
})
.catch(err => {
	console.log(err);
	throw err;
});
