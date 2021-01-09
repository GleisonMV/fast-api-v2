const envSchema = require('env-schema')
const schema = {
  type: 'object',
  properties: {
    MONGO_URL: { type: 'string' },
    MONGO_DB: { type: 'string' }
  },
  required: ['MONGO_URL', 'MONGO_DB']
}
const env = envSchema({
  schema: schema,
  dotenv: true
})

const config = {
  mongodb: {
    url: env.MONGO_URL,
    databaseName: env.MONGO_DB,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js'
}

module.exports = config
