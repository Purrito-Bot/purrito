import mongoose, { Schema, Document, Model } from 'mongoose'
import config from '../config.json'

export interface GuildSettings {
    randomSpeechProbability: number
}

export interface PurritoState {
    lives: number
    timeOfDeath: Date | null
}

export interface IGuild extends Document {
    guildId: string
    settings: GuildSettings
    purritoState: PurritoState
}

export interface IGuildModel extends Model<IGuild> {
    findByGuildId(id: string): Promise<IGuild>
}

const GuildSchema: Schema = new Schema({
    guildId: { type: String, required: true, unique: true },
    settings: {
        randomSpeechProbability: Number,
    },
    purritoState: {
        lives: Number,
        timeOfDeath: Date,
    },
})

GuildSchema.statics.findByGuildId = async function(id: string) {
    return this.findOne({ guildId: id }).exec()
}

export default mongoose.model<IGuild, IGuildModel>('Guild', GuildSchema)
