import mongoose, { Schema, Document, Model } from 'mongoose'

export interface GuildSettings {
    randomSpeechProbability: number
}

export interface IGuild extends Document {
    guildId: string
    settings: GuildSettings
}

export interface IGuildModel extends Model<IGuild> {
    findByGuildId(id: string): Promise<IGuild>
}

const GuildSchema: Schema = new Schema({
    guildId: { type: String, required: true, unique: true },
    settings: {
        randomSpeechProbability: Number,
    },
})

GuildSchema.statics.findByGuildId = async function(id: string) {
    return this.findOne({ guildId: id }).exec()
}

export default mongoose.model<IGuild, IGuildModel>('Guild', GuildSchema)
