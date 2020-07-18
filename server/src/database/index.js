import Sequelize from 'sequelize';
import mongoose from 'mongoose';

// importtar todos os models
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

// importar as configurações
import databaseConfig from '../config/database';

// array com todos os models importados
const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // chamar o método init de cada model
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true }
    )
  }
}

export default new Database;
