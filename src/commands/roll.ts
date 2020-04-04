import { Message } from 'discord.js'
import { logger } from '../logger'
import * as dndLoader from '../dndBeyond/loader';

export default async function roll(message: Message) {

    logger.debug("Entering roll command")

    try {

        const playerIds = [
            '24651802',
            '24253076',
            '24656013',
            '25421550',
            '24619518',
            '24135503',
            '25427153'];

        const playerRolls: { name: string, roll: number, initiative: number, total: number }[] = [];
        for (const playerId of playerIds) {

            console.log(`Getting character for ID ${playerId}`)
            const player = await dndLoader.loadCharacterFromId(playerId);

            const roll = Math.floor(Math.random() * 20) + 1;
            const playerRoll = {
                name: player.name,
                roll: roll,
                initiative: player.initiativeModifier,
                total: player.initiativeModifier + roll
            };
            playerRolls.push(playerRoll);
        }

        const sortedPlayerRolls = playerRolls.sort((prA, prB) => (prA.total > prB.total) ? 1 : -1).reverse();

        let responseMessage = 'I am the dice king!\n';
        for (const playerRoll of sortedPlayerRolls) {
            responseMessage += `${playerRoll.name}: ${playerRoll.roll} + ${playerRoll.initiative} = ${playerRoll.total}\n`;
        }
        await message.channel.send(responseMessage);

        logger.debug("Finished roll command");
    }
    catch (e) {
        logger.error('Failed to roll', e);
    }
}
