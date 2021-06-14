import { Guild } from 'discord.js'
import { logger } from '../logger'

export default function (guild: Guild) {
    logger.info(`Removed from: ${guild.name} (id: ${guild.id})`)
}
