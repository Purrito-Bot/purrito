// Load up the discord.js library
import Discord, { Message } from 'discord.js'

// config.token contains the bot's token
// config.prefix contains the message prefix.
import config from './config.json'

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client()

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
    client.user?.setActivity(`Serving ${client.guilds.cache.size} servers`)
})

client.on('guildDelete', guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`)
    client.user?.setActivity(`Serving ${client.guilds.cache.size} servers`)
})

client.on('message', async (message: Discord.Message) => {
    // This event will run on every single message received, from any channel or DM.

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return

    // Also good practice to ignore any message that does not start with our prefix,
    // which is set in the configuration file.

    if (message.content.indexOf(config.prefix) !== 0) {
        // Randomly meow when a message is received
        if (Math.random() < 0.05) {
            await message.channel.send('Meow.')
        }
        return
    }
    // Here we separate our "command" name, and our "arguments" for the command.
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g)
    const command = args.shift()!.toLowerCase()

    if (command === 'ping') {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        const m = await message.channel.send('Ping?')
        m.edit(
            `Pong! Latency is ${m.createdTimestamp -
                message.createdTimestamp}ms.`
        )
    }
})

client.login(process.env.TOKEN)
