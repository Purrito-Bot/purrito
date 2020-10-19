import { StreamDispatcher, VoiceChannel, VoiceConnection } from 'discord.js'

export type SongQueue = {
    songs: { title: string; url: string }[]
    volume: number
    playing: boolean
    voiceChannel?: VoiceChannel
    connection?: VoiceConnection
    dispatcher?: StreamDispatcher
}
