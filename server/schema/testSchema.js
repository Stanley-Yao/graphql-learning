const graphql = require("graphql");

const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLNonNull,
} = graphql;

//scalar type
/*
    string graphqlString
    int
    float
    boolean
    id
*/

const Person = new GraphQLObjectType({
	name: "Person",
	description: "REpresensts a persona",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: new GraphQLNonNull(GraphQLString) },
		age: { type: GraphQLInt },
		isMarried: { type: GraphQLBoolean },
		gpa: { type: GraphQLFloat },
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "Root",
	description: "description",
	fields: {
		person: {
			type: Person,
			resolve: (parent, args) => ({
				name: null,
				age: 35,
				isMarried: true,
				gpa: 4.0,
			}),
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
});
