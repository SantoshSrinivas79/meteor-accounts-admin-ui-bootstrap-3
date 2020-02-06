filteredUserQuery = function(userId, filter) {
	let options = {};
	options.fields = { services: false };
	options.sort = {emails: 1};

	// if not an admin user don't show any other user
	if (!Roles.userIsInRole(userId, ['admin']))
		return Meteor.users.find(userId, options);


	if(!!filter) {
		// TODO: passing to regex directly could be dangerous
		users = Meteor.users.find({
			$or: [
				{username: {$regex: filter, $options: 'i'}},
				{'emails.address': {$regex: filter, $options: 'i'}}
			]
		}, options);
	} else {
		users = Meteor.users.find({}, options);
	}

	var user_array = users.fetch();
	// console.log(user_array);

	var userids = _.pluck(user_array, "_id");
	// console.log("userids are: " + userids);

	var roles = Meteor.roleAssignment.find({ 'user._id': { $in: userids } });

	// console.log(roles.fetch());

	return [users, roles];
};