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

| Command  | Parameters                           | Behaviour                                                                                                  |
| -------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `+speak` | -                                    | Sends `Meow!` to the channel .                                                                             |
| `+do`    | verb or sentence beginning with verb | Responds with italised message with Purrito carryingout the action. e.g. `+do glare` -> _`purrito glares`_ |
| `+ping`  | -                                    | Responds with the round-trip latency between sending a message and editing it.                             |

## :runner: Running your own Purrito

### Prerequisites

-   A Discord bot token from the Discord developer portal
    -   Follow the instructions [here](https://discordapp.com/developers/docs/intro) to set up your bot.

### Running

Purrito is released as a Docker image with a dependency on a [mongodb](https://www.mongodb.com/) database for storing pesistent data such as Discord server configuration.

1. Download the example Docker Compose file from this repository:

```bash
wget https://raw.githubusercontent.com/djaustin/purrito/master/docker-compose.yml
```

2. Update the file to contain your own Discord bot token in place of `changeme` in the following YAML.

```yaml
purrito:
    build: .
    image: daustin/purrito:latest
    restart: always
    environment:
        - TOKEN=changeme
    depends_on:
        - mongo
```

3. Run `docker-compose up` to start your own Purrito.

4. Follow instructions [here](https://discordpy.readthedocs.io/en/latest/discord.html#inviting-your-bot) to generate a link which will allow Discord users to invite your bot to their server.

### :memo: Logs

Purrito uses [Winston](https://github.com/winstonjs/winston) for logging. Debug level logs are written to the console and `purrito.log`.

Log configuration is managed in `src/logger.ts`.

## :book: License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
