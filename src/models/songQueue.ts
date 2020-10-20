import { StreamDispatcher, VoiceChannel, VoiceConnection } from 'discord.js'
import ytdl from 'ytdl-core'
import { logger } from '../logger'

export type Song = {
    title: string
    url: string
}

export class Music {
    /** The queued up songs */
    songs: Song[]
    /** Which song in the queue is currently being played (0 based index) */
    musicIndex: number
    /** The volume which Purrito will play the music */
    volume: number
    /** Whether or not music is currenty playing */
    playing: boolean
    /** The voice channel which Purrito is playing in */
    voiceChannel?: VoiceChannel
    /** Information about the connection to the voice channel */
    connection?: VoiceConnection
    /** The music controller */
    dispatcher?: StreamDispatcher

    constructor() {
        this.songs = []
        this.volume = 5
        this.playing = false
        this.musicIndex = 0
    }

    async join(voiceChannel: VoiceChannel) {
        this.voiceChannel = voiceChannel
        this.connection = await voiceChannel.join()
    }

    leave() {
        this.voiceChannel?.leave()
        this.voiceChannel = undefined
        this.connection = undefined
        this.dispatcher = undefined
        this.playing = false
    }

    addSong(song: Song) {
        this.songs.push(song)
    }

    play() {
        if (!this.songs[this.musicIndex]) {
            this.leave()
        } else if (this.dispatcher && !this.playing) {
            this.dispatcher.resume()
            this.playing = true
        } else if (this.playing) {
            logger.debug('play called when already playing')
        } else {
            const song = ytdl(this.songs[this.musicIndex].url, {
                filter: 'audioonly',
            })
            this.dispatcher = this.connection
                ?.play(song)
                .on('finish', () => {
                    this.musicIndex++
                    this.play()
                })
                .on('error', error => console.log(error))
            this.playing = true
            this.dispatcher?.setVolumeLogarithmic(this.volume / 5)
        }
    }

    reset() {
        this.songs = []
        this.leave()
    }

    skip(songNumber?: number) {
        // Because 0 is undefined/null... Just JS things
        if (songNumber === 0) {
            this.musicIndex = 0
        } else {
            this.musicIndex = songNumber || this.musicIndex + 1
        }
        if (this.dispatcher) {
            this.playing = false
            this.dispatcher.pause()
            this.dispatcher = undefined
            this.play()
        }
    }

    setVolume(volume: number) {
        this.volume = volume
        if (this.dispatcher) {
            this.dispatcher.setVolumeLogarithmic(volume / 5)
        }
    }
}
