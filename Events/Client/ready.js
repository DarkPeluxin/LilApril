const {Client} = require('discord.js')
const mongoose = require('mongoose')
const config = require('../../config.json')

module.exports = {
    name: 'ready',
    once: true,

    async execute(client) {
        try {
            mongoose.set('strictQuery', false);
            await mongoose.connect('mongodb://localhost:27017/DiscordData', { useNewUrlParser: true, useUnifiedTopology: true });

            if (mongoose.connect) {
                console.log('MongoDB connection successful.')
            }

            console.log(`${client.user.username} is now online.`)
        }
        catch (error) {
            console.log(`Error ${error}`)
        }
    }
}