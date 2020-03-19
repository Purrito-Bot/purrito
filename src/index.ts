import { Client, Message } from 'discord.js'
import dotenv from 'dotenv'
import { randomMeow } from './commands/randomMeow'
import config from './config.json'
import { executeCommand } from './utils'
// Initialise dotenv config - if you're doing config that way
dotenv.config()

const client = new Client()

client.on('ready', () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(
        `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
    )
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user?.setActivity(`with yarn`)
})

client.on('guildCreate', guild => {
    // This event triggers when the bot joins a guild.
    console.log(
        `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
    )
    client.user?.setActivity(`with yarn`)
})

client.on('guildDelete', guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`)
    client.user?.setActivity(`with yarn`)
})

client.on('message', async (message: Message) => {
    // This event will run on every single message received, from any channel or DM.

    // Ignore other bots
    if (message.author.bot) return

    // On messages without prefix run these commands
    if (message.content.indexOf(config.prefix) !== 0) {
        // Randomly meow when a message is received
        randomMeow(message)
        return
    }

    executeCommand(message)
})

client.login(process.env.TOKEN)
