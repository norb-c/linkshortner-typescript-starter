require('dotenv/config');

const databaseConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'shortener',
  port: Number(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  define: {
    underscored: true,
    timestamps: true,
    freezeTableName: true
  },
  logQueryParameters: true,
  // @ts-ignore
  logging: str => {
    return process.env.SHOW_DB_NAME_QUERIES === 'true' ? console.log(`[DATABASE QUERY ${new Date()}] => ${str}`) : null;
  }
};

module.exports = {
  development: {
    ...databaseConfig
  },
  test: {
    ...databaseConfig
  },
  staging: {
    ...databaseConfig
  },
  production: {
    ...databaseConfig,
    dialect: 'postgres'
  }
};
