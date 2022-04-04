const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type User {
    _id: ID!
    username: String!
    password: String
}

type AuthData {
    username: String!
    token: String!
    tokenExpiry: Int!
}

type CountryData {
    fullname: String!
    population: Int!
    currencies: String!
    exchangeRate: Float!
}

input CountryInput {
    name: String!
}

input UserInput {
    username: String!
    password: String!
}

type RootQuery {
    login(userInput: UserInput!): AuthData!
    fetchCountryDetails(countryInput: CountryInput!): CountryData!
}

type RootMutation {
    createUser(userInput: UserInput!): User
}

schema {
    query: RootQuery,
    mutation: RootMutation
}
`);