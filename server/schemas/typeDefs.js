const { gql } = require('apollo-server-express');

const typeDefs = gql `
type User {
    _id: ID
    username: String
    description: String
    password: String
    savedBooks: [Book]
}

type Book {
    _id: ID
    authors: [String]
    description: String
    bookId: String
    image: String
    title: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    getUser(userId: ID, username: String, email: String): User
}

type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(authors: [String], bookIs: String, description: String!, image: String, link: String, title: String!): User
    deleteBook(bookId: ID!): User
}

`;

module.exports = typeDefs;