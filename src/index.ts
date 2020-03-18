// Load up the discord.js library
import Discord from 'discord.js'

// config.token contains the bot's token
// config.prefix contains the message prefix.
import config from './config.json'

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();


client.login(config.token);