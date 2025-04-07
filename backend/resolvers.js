const { finished } = require('stream/promises');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');

const missions = [];
const employees = [
  { id: 1, name: "Alice Johnson", department: "Engineering", position: "Developer" },
  { id: 2, name: "Bob Smith", department: "Marketing", position: "Manager" },
  { id: 3, name: "Carol Lee", department: "Engineering", position: "QA Tester" },
];

const resolvers = {
  Query: {
    missions: () => missions,
    searchEmployees: (_, { department, position }) => {
      return employees.filter(emp => {
        const deptMatch = department ? emp.department.toLowerCase().includes(department.toLowerCase()) : true;
        const posMatch = position ? emp.position.toLowerCase().includes(position.toLowerCase()) : true;
        return deptMatch && posMatch;
      });
    }
  },

  Mutation: {
    addMission: (_, { mission_name, launch_year }) => {
      const newMission = {
        id: missions.length + 1,
        mission_name,
        launch_year,
      };
      missions.push(newMission);
      return newMission;
    },

    signup: async (_, { name, email, password }) => {
      const existing = await User.findOne({ email });
      if (existing) {
        throw new Error('Email already registered.');
      }

      const newUser = new User({ name, email, password });
      await newUser.save();
      return newUser;
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      if (user.password !== password) {
        throw new Error('Incorrect password');
      }

      return user;
    },

    uploadFile: async (_, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();

      const uploadDir = path.join(__dirname, 'uploads');
      const filePath = path.join(uploadDir, filename);

      await fs.promises.mkdir(uploadDir, { recursive: true });

      const out = fs.createWriteStream(filePath);
      stream.pipe(out);
      await finished(out);

      return { filename, mimetype, encoding };
    }
  }
};

module.exports = resolvers;
