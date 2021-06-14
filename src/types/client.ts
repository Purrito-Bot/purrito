import { Client, ClientOptions, Collection, Message } from 'discord.js'
import fs from 'fs'
import guildCreate from '../handlers/guildCreate'
import guildDelete from '../handlers/guildDelete'
import message from '../handlers/message'
import ready from '../handlers/ready'
import { CommandsCollection, Command } from './command'

/**
 * An extension of the discord.js Client class, which also includes commands.
 */
export class Purrito extends Client {
    commands: CommandsCollection = new Collection()

    constructor(cadenceOptions?: { token?: string }, options?: ClientOptions) {
        super(options)

        // Initialises all the commands found in the /commands directory
        initCommands(this)

        this.on('ready', () => ready(this))

        this.on('guildCreate', guildCreate)

        this.on('guildDelete', guildDelete)

        // This event will run on every single message received, from any channel or DM.
        this.on('message', async (userMessage: Message) =>
            message(userMessage, this.commands)
        )

        this.login(cadenceOptions?.token)
    }
}

/**
 * Go through the ../commands directory and scan the folder for anything which
 * extends {@link Command}, then initialise the command and add it to the list of
 * commands known to the client
 * @param client
 */
async function initCommands(client: Purrito) {
    // Initialises all the commands found in the /commands directory
    const commandFileDir = `${__dirname}/../commands`

    const commandFiles = fs.readdirSync(commandFileDir)
    for (const file of commandFiles) {
        const commandClass = await import(`../commands/${file}`)

        if (commandClass.default) {
            const command = new commandClass.default()
            if (command instanceof Command) {
                command.init(client)
                client.commands.set(command.name, command)
            }
        }
    }
}
