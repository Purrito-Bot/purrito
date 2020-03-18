# :cat: Purrito

![Build & Test](https://github.com/djaustin/purrito-bot/workflows/Build%20&%20Test/badge.svg)
![Publish Image and Deploy](https://github.com/djaustin/purrito/workflows/Publish%20Image%20and%20Deploy/badge.svg)
![Docker Pulls](https://img.shields.io/docker/pulls/daustin/purrito)
![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/daustin/purrito)

A friendly companion cat for your Discord server.

## :heavy_plus_sign: Add Purrito to your server

Visit [this link](https://discordapp.com/api/oauth2/authorize?client_id=689827099866824759&permissions=0&scope=bot) and log in with Discord to invite the Purrito to your server.

## :speech_balloon: Usage

Purrito commands use the plus symbol '+' as a prefix.

Purrito will respond to approximately 5% of messages with a 'Meow.'. It also has the following user commands

| Command  | Behaviour                                                                      |
| -------- | ------------------------------------------------------------------------------ |
| `+speak` | Sends `Meow!` to the channel .                                                 |
| `+ping`  | Responds with the round-trip latency between sending a message and editing it. |

## :runner: Running your own Purrito

1. Follow the instructions [here](https://discordapp.com/developers/docs/intro) to set up your bot in the Discord developer portal.
2. Retrieve your bot token from the developer portal.
3. Pull and run the docker image at https://hub.docker.com/r/daustin/purrito
   `docker image pull daustin/purrito`
   `docker container run -d -e TOKEN=<YOUR_TOKEN> daustin/purrito`
4. Follow instructions [here](https://discordpy.readthedocs.io/en/latest/discord.html#inviting-your-bot) to generate a link which will allow Discord users to invite your bot to their server.

## :computer: Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

### Technology

Purrito is built using the [discord.js](https://discord.js.org/#/) node module. Visit the link for documentation.

Code is written in [TypeScript](https://www.typescriptlang.org/) and runs in a [Docker](https://www.docker.com/) container.

### Getting started

1. Pull the repository
2. Navigate to the repository on your local machine and run `npm installl` to install dependencies.
3. Run `npm run build` to transpile the TypeScript code to JavaScript.
4. Run `node dist/index.js` to run the bot on your local machine.
    - Note you will need to have the bot token specified as an environment variable named `TOKEN` for the bot to be able to login.
5. Run `docker image build -t purrito .` to test that the Docker image successfully builds on your local machine.
6. Ensure necessary changes to tests and documentation are completed.
7. Make a pull request for review.

## :book: License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
