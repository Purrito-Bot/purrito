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
