const graphql = require("graphql");
const { find, filter } = require("lodash");
const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
} = graphql;

//Create types
const UserType = new GraphQLObjectType({
	name: "User",
	description: "doc for user",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		hobby: { type: HobbyType },
		profession: { type: GraphQLString },
		comment: { type: CommentType },
		comments: {
			type: new GraphQLList(CommentType),
			resolve(parent, args) {
				return filter(commentData, { userId: parent.id });
			},
		},
	}),
});

const HobbyType = new GraphQLObjectType({
	name: "Hobby",
	description: "Desc",
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		description: { type: GraphQLString },
		user: {
			type: UserType,
			resolve: (parent, args) => find(usersData, { id: args.userId }),
		},
	}),
});

//Post Type
const CommentType = new GraphQLObjectType({
	name: "Post",
	description: "Post Type",
	fields: () => ({
		id: { type: GraphQLID },
		comment: { type: GraphQLString },
		user: {
			type: UserType,
			resolve: (parent, args) => find(usersData, { id: parent.userId }),
		},
	}),
});

let usersData = [
	{ id: "5", name: "Stanley", age: 34, profession: "1test" },
	{ id: "1", name: "Nancy", age: 35, profession: "2test" },
	{ id: "2", name: "haha", age: 36, profession: "3test" },
	{ id: "3", name: "LOL", age: 37, profession: "4test" },
	{ id: "4", name: "TEST", age: 38, profession: "5test" },
];

let hobbyData = [
	{
		id: "5",
		title: "Stanley hobby",
		description: "1test hobby",
		userId: "1",
	},
	{ id: "1", title: "Nancy hobby", description: "2test hobby", userId: "2" },
	{ id: "2", title: "haha hobby", description: "3test hobby", userId: "1" },
	{ id: "3", title: "LOL hobby", description: "4test hobby", userId: "1" },
	{ id: "4", title: "TEST hobby", description: "5test hobby", userId: "2" },
];

let commentData = [
	{ id: "5", comment: "Stanley Coooooooooomment", userId: "1" },
	{ id: "1", comment: "Nancy Coooooooooomment", userId: "1" },
	{ id: "2", comment: "haha Coooooooooomment", userId: "2" },
	{ id: "3", comment: "LOL Coooooooooomment", userId: "2" },
	{ id: "4", comment: "TEST Coooooooooomment", userId: "2" },
];
//Root query
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	description: "blah",
	fields: {
		user: {
			type: UserType,
			args: {
				id: {
					type: GraphQLString,
				},
			},
			resolve(parent, args) {
				return find(usersData, { id: args.id });
			},
		},

		hobby: {
			type: HobbyType,
			args: {
				id: {
					type: GraphQLString,
				},
			},
			resolve: (parent, args) => {
				return find(hobbyData, { id: args.id });
			},
		},

		comment: {
			type: CommentType,
			args: {
				id: {
					type: GraphQLString,
				},
			},
			resolve: (parent, args) => {
				return find(commentData, { id: args.id });
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
});
