require('dotenv').config()

module.exports = {
    mysql: {
      host: 'us-cdbr-east-02.cleardb.com',
      user: 'bcf827ce5d43a8',
      password: '09196a9c',
      database: 'heroku_1ec596bb0f3974f'
    },
    secret: process.env.MY_SECRET
}