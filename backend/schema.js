const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload

  type Mission {
    id: ID
    mission_name: String
    launch_year: String
  }

  type Employee {
    id: ID
    name: String
    department: String
    position: String
  }

  type User {
    id: ID
    name: String
    email: String
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    missions: [Mission]
    searchEmployees(department: String, position: String): [Employee]
  }

  type Mutation {
    addMission(mission_name: String!, launch_year: String!): Mission
    uploadFile(file: Upload!): File
    signup(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User   # ✅ Added here
  }
`;

module.exports = typeDefs;
