import mongoose from 'mongoose'
import Guild, { GuildSettings, IGuild } from './models/guild'
import { logger } from './logger';
import config from './config.json'

let databaseConnected = false;

const defaultSettings: GuildSettings = {
    randomSpeechProbability: 0.05,
}

export function connectDatabase() {
    mongoose.connect(
        process.env.MONGO_CONNECTION_STRING || 'mongodb://mongo:27017/purrito',
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

        .then(() => {
            logger.info("Database successfully connected.")
            databaseConnected = true;
        })
        .catch(e => {
            logger.warn('Database connection failed.', e)
        });
}

export async function findByGuildId(id: string): Promise<GuildSettings> {

    let guildSettings = defaultSettings;

    // findBy methods hang forever if the database is not already connected
    if (databaseConnected) {
        try {
            // Determine settings for this message
            const savedGuild = await Guild.findByGuildId(id);
            guildSettings = savedGuild?.settings || defaultSettings;
        }
        catch (e) {
            logger.warn(e);
        }
    }
    return guildSettings;
}

export async function findOrMakeGuild(guildId: string) {
    // Try to get existing guild config
    let guild: IGuild | null = null;
    // findBy methods hang forever if the database is not already connected
    if (databaseConnected) {
        try {
            guild = await Guild.findOne({ guildId: guildId })
        }
        catch (e) {
            logger.warn(e)
        }
    }
    if (!guild) {
        // Create config if none exists yet for this guild
        guild = new Guild({
            guildId: guildId,
            settings: config.defaultSettings,
            purritoState: config.defaultPurritoState,
        })
    }
    return guild
}