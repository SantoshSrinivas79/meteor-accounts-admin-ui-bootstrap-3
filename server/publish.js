Meteor.publish('roles', function (){
  console.log("publishing roles");
	return Meteor.roles.find({});
});

Meteor.publish('filteredUsers', function(filter) {
  // credit: https://stackoverflow.com/questions/34805529/meteor-js-check-field-combination-of-match-optional-and-match-oneof
  check(filter, Match.Optional(Match.OneOf(Object, null, String)));
  console.log("the filter in filteredUsers is: ");
  console.log(filter);
  
	return filteredUserQuery(this.userId, filter);
});

new Meteor.Pagination(Meteor.users, {
    transform_options: function (filters, options) {
        const fields = { services: 0 };
        options.fields = _.extend(fields, {});
        return options;
    }
});