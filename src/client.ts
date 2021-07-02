import { Client, ClientOptions, Collection, Guild, Message } from 'discord.js';
import fs from 'fs';
import { prefix } from './config.json';
import { checkUserCanRun, logger, parseMessage } from './shared';
import { Command, CommandsCollection } from './types';

/*
 * An extension of the discord.js Client class, which also includes commands.
 */
export class Purrito extends Client {
  commands: CommandsCollection = new Collection();

  constructor(cadenceOptions?: { token?: string }, options?: ClientOptions) {
    super(options);

    // Initialises all the commands found in the /commands directory
    initCommands(this);

    this.on('ready', () => ready(this));

    this.on('guildCreate', guildCreate);

    this.on('guildDelete', guildDelete);

    // This event will run on every single message received, from any channel or DM.
    this.on('message', async (userMessage: Message) =>
      message(userMessage, this.commands)
    );

    this.login(cadenceOptions?.token);
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
  const commandFileDir = `${__dirname}/./commands`;

  fs.readdirSync(commandFileDir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)
    .forEach(async (file) => {
      const commandClass = await import(`./commands/${file}`);

      if (commandClass.default) {
        const command = new commandClass.default();
        if (command instanceof Command) {
          command.init(client);
          client.commands.set(command.name, command);
        }
      }
    });
}

function guildCreate(guild: Guild) {
  logger.info(
    `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
  );
}

function guildDelete(guild: Guild) {
  logger.info(`Removed from: ${guild.name} (id: ${guild.id})`);
}

function message(message: Message, commands: CommandsCollection) {
  // Ignore bots, messages from outside guilds and messages without the prefix
  if (
    !message.content.startsWith(prefix) ||
    message.author.bot ||
    !message.guild
  ) {
    return;
  }

  logger.debug('Entered on message.');

  const { command, args } = parseMessage(message);

  const runnableCommand = commands.get(command);

  // Check the user has permissions to run the command before executing it
  if (runnableCommand && checkUserCanRun(message.member!, runnableCommand)) {
    if (runnableCommand.subCommands && args.length > 0) {
      const subcommand = args.splice(0, 1)[0];
      if (runnableCommand[subcommand]) {
        runnableCommand[subcommand](message, args);
        return;
      }
    }
    runnableCommand.run(message, args);
  }
}

function ready(client: Purrito) {
  logger.info(
    `Purrito is with ${client.users.cache.size} users in ${client.guilds.cache.size} guilds.`
  );

  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user?.setActivity('with yarn');
}
