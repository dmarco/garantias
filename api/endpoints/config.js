module.exports = {
  port: process.env.PORT || 3001,
  db: process.env.MONGODB_URI || 'mongodb://mongodb_container/cyc_db',
  SECRET_TOKEN: 'miclavedetokens'
}
