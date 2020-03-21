# :cat: Purrito

![Build & Test](https://github.com/djaustin/purrito-bot/workflows/Build%20&%20Test/badge.svg)
![Publish Image and Deploy](https://github.com/djaustin/purrito/workflows/Publish%20Image%20and%20Deploy/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/fc1d27cb162204bdc70f/maintainability)](https://codeclimate.com/github/djaustin/purrito/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/fc1d27cb162204bdc70f/test_coverage)](https://codeclimate.com/github/djaustin/purrito/test_coverage)
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

## :book: License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
