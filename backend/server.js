const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const User = require('./models/User'); 

const startServer = async () => {
  const app = express();
  app.use(cors());

  
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(async () => {
    console.log("✅ Connected to MongoDB");

    
    try {
      await mongoose.connection.db.collection('users').dropIndex('username_1');
      console.log('✅ Dropped old username index.');
    } catch (err) {
      if (err.codeName !== 'IndexNotFound') {
        console.error('❌ Failed to drop index:', err);
      } else {
        console.log('ℹ️ No username index found — nothing to drop.');
      }
    }
  }).catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
