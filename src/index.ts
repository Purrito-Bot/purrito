import { Client, Message } from 'discord.js'
import dotenv from 'dotenv'
import * as fs from 'fs'
import mongoose from 'mongoose'
import { executeCommand } from './commands/executeCommand'
import { speak } from './commands/speak'
import config from './config.json'
import { logger } from './logger'
import Guild, { GuildSettings } from './models/guild'
import { MusicController } from './models/musicController'

// Initialise dotenv config - if you're doing config that way
dotenv.config()

const client = new Client()
export const botMusic = new Map<string, MusicController>()

const defaultSettings: GuildSettings = {
    randomSpeechProbability: 0.05,
}

mongoose.connect(
    process.env.MONGO_CONNECTION_STRING || 'mongodb://mongo:27017/purrito',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
)

client.on('ready', () => {
    // This event will run if the bot starts, and logs in, successfully.

    // print banner text. only the console needs to this.
    try {
        var data = fs.readFileSync('./src/banner.txt', 'utf8')
        console.log(data)
    } catch (e) {
        logger.warn('Failed to print banner text.', e)
    }

    logger.info(
        `Purrito is awake, with ${client.users.cache.size} users in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
    )

    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user?.setActivity(`with yarn`)
})

client.on('guildCreate', async (guild) => {
    // This event triggers when the bot joins a guild.
    logger.info(
        `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
    )
})

client.on('guildDelete', (guild) => {
    // this event triggers when the bot is removed from a guild.
    logger.info(`I have been removed from: ${guild.name} (id: ${guild.id})`)
})

client.on('message', async (message: Message) => {
    // This event will run on every single message received, from any channel or DM.
    logger.debug('Entered on message.')

    // Ignore messages outside servers
    if (!message.guild) return

    // Determine settings for this message
    const savedGuild = await Guild.findByGuildId(message.guild.id)
    const guildSettings = savedGuild?.settings || defaultSettings

    // Ignore bots
    if (message.author.bot) return

    if (message.content.indexOf(config.prefix) === 0) {
        executeCommand(message)
    } else {
        // On messages without prefix run these commands
        // Randomly meow when a message is received
        if (Math.random() < guildSettings.randomSpeechProbability) {
            speak(message)
        }
    }
})

client.login(process.env.TOKEN)
