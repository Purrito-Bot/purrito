## :computer: Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

### Technology

Purrito is built using the [discord.js](https://discord.js.org/#/) node module. Visit the link for documentation.

Code is written in [TypeScript](https://www.typescriptlang.org/) and runs in a [Docker](https://www.docker.com/) container.

For persistent storage of data such as server-specific configuration, Purrito has a dependency on a [MongoDB](https://www.mongodb.com/) database.

### Getting started

#### Prerequisites

- A Discord bot token from the Discord developer portal.
  - Follow the instructions [here](https://discordapp.com/developers/docs/intro) to set up your bot.
- MongoDB database. You can run this yourself using a method of your choice or use Docker to create an ephemeral database for development. e.g.

  `docker container run --name purrito-mongo -p 27017:27017 -d mongo`

#### Build and run

1. Pull the repository
2. Navigate to the repository on your local machine and run `npm installl` to install dependencies.
3. Run `npm run build` to transpile the TypeScript code to JavaScript.
4. Ensure that you have the following environment variables set either as CLI environement variables or by creating a `.env` file in the root of the repository with the following format.

   ```ini
   KEY=VALUE
   ```

   | Variable                | Description                                                                                                |
   | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
   | TOKEN                   | Your own Discord bot token                                                                                 |
   | MONGO_CONNECTION_STRING | Connection string for the MongoDB Purrito will use in development e.g. `mongodb://localhost:27017/purrito` |

5. Run `node dist/index.js` to run the bot on your local machine.
6. Run `npm test` to run tests.
7. Run `docker image build -t purrito .` to test that the Docker image successfully builds on your local machine.
8. Ensure necessary changes to tests and documentation are completed.
9. Make a pull request for review.
