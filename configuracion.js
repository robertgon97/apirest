module.exports={
    port: process.env.PORT || 3000,
    db: process.env.MONGODB || 'mongodb://localhost/apirest',
    SECRET_TOKEN: 'miclavedetokens'
}