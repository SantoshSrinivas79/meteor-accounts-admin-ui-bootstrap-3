Meteor.methods({
	deleteUser: function(userId) {
		check(userId, String);
		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to delete a user.");

		if (user._id == userId)
			throw new Meteor.Error(422, 'You can\'t delete yourself.');
		
		// remove the user
		Meteor.users.remove(userId);
	},

	addUserRole: function(userId, role) {
		check(userId, String);
		check(role, String);

		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to update a user.");

		if (user._id == userId)
			throw new Meteor.Error(422, 'You can\'t update yourself.');

		// handle invalid role
		if (Meteor.roles.find({_id: role}).count() < 1 )
			throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

		// handle user already has role
		if (Roles.userIsInRole(userId, role))
			throw new Meteor.Error(422, 'Account already has the role ' + role);

		// add the user to the role
		Roles.addUsersToRoles(userId, role);
	},

	removeUserRole: function(userId, role) {
		check(userId, String);
		check(role, String);

		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to update a user.");

		if (user._id == userId)
			throw new Meteor.Error(422, 'You can\'t update yourself.');

		// handle invalid role
		if (Meteor.roles.find({_id: role}).count() < 1 )
			throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

		// handle user already has role
		if (!Roles.userIsInRole(userId, role))
			throw new Meteor.Error(422, 'Account does not have the role ' + role);

		Roles.removeUsersFromRoles(userId, role);
	},

	addRole: function(role) {
		check(role, String);

		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to update a user.");

		// handle existing role
		if (Meteor.roles.find({_id: role}).count() > 0 )
			throw new Meteor.Error(422, 'Role ' + role + ' already exists.');

		Roles.createRole(role);
	},

	removeRole: function(role) {
		check(role, String);

		console.log("going to remove role");
		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to update a user.");

		// handle non-existing role
		if (Meteor.roles.find({_id: role}).count() < 1 )
			throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

		if (role === 'admin')
			throw new Meteor.Error(422, 'Cannot delete role admin');

		// remove the role from all users who currently have the role
		// if successfull remove the role


		Roles.deleteRole(role);

		console.log("also going to delete role from users");


		var users = Meteor.users.find({},{fields: {_id:1}}).fetch();
		// you can also use Roles.getUsersInRole: [Using the Roles Package | The Meteor Chef](https://themeteorchef.com/tutorials/using-the-roles-package)
		// console.log(users);

		_.each(users, function(user) {
			// console.log(user._id);
			Roles.removeUsersFromRoles(user._id, role);
		});
	},

	updateUserInfo: function(id, property, value) {
		check(id, String);
		check(property, String);
		check(value, String);

		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to update a user.");

		if (property !== 'username')
			throw new Meteor.Error(422, "Only 'name' is supported.");

		obj = {};
		obj[property] = value;
		Meteor.users.update({_id: id}, {$set: obj});
	}
});