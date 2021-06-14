import { Guild } from 'discord.js'
import { logger } from '../logger'

export default function (guild: Guild) {
    logger.info(
        `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
    )
}
