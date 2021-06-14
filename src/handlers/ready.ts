import { logger } from '../logger'
import { Purrito } from '../types/client'

export default function (client: Purrito) {
    logger.info(
        `Purrito is with ${client.users.cache.size} users in ${client.guilds.cache.size} guilds.`
    )

    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user?.setActivity('with yarn')
}
