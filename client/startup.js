Meteor.startup(function() {
	Meteor.subscribe('roles');
  Meteor.subscribe('filteredUsers', Session.get('userFilter'));
});