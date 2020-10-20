import {
    MessageEmbed,
    StreamDispatcher,
    VoiceChannel,
    VoiceConnection,
} from 'discord.js'
import ytdl from 'ytdl-core'
import { logger } from '../logger'
import { PrintableObject } from './printableObject'
import { Song } from './song'

export class Music implements PrintableObject {
    /** The queued up songs */
    songs: Song[]
    /** Which song in the queue is currently being played (0 based index) */
    musicIndex: number
    /** The volume which Purrito will play the music */
    volume: number
    /** Whether or not a song should loop */
    loop: boolean
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
        this.loop = false
        this.playing = false
        this.musicIndex = 0
    }

    createEmbed(): MessageEmbed {
        const embed = new MessageEmbed()

        embed.setTitle('Music Queue')
        embed.setDescription(
            'Welcome to the best music event on Discord, here is the set list:'
        )
        this.songs.forEach((song, index) => {
            if (this.musicIndex === index) {
                embed.addField(
                    `Song ${index} 🎵 ${
                        this.playing ? 'Now playing' : 'On the deck'
                    } 🎵`,
                    song.title
                )
            } else {
                embed.addField(`Song ${index}`, song.title)
            }
        })
        embed.addField('Settings', [
            `Looping: ${this.loop ? 'On' : 'Off'}`,
            `Volume: ${this.volume}`,
            `Voice channel: ${
                this.voiceChannel ? this.voiceChannel.name : 'Not connected'
            }`,
        ])
        embed.setFooter([`Use +music help to find out more`])

        return embed
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
        this.musicIndex = 0
    }

    addSong(song: Song) {
        this.songs.push(song)
    }

    removeSong(songIndex: number): Song | undefined {
        const song = this.songs.splice(songIndex, 1)
        this.musicIndex = this.musicIndex - 1
        if (!this.playing && this.musicIndex < 0) {
            this.musicIndex = 0
        }
        return song[0]
    }

    play() {
        if (!this.songs[this.musicIndex] && this.songs.length > 0) {
            // If we've reached the end of the play list, and there are still songs in there, go back to the start
            this.musicIndex = 0
        } else if (!this.songs[this.musicIndex] && this.songs.length === 0) {
            // If we reach the end of the playlist and the playlist is empty, leave the voice channel
            this.leave()
        }

        if (this.dispatcher && !this.playing) {
            this.dispatcher.resume()
            this.playing = true
        } else if (this.playing) {
            logger.debug('play called when already playing')
        } else {
            const song = ytdl(this.songs[this.musicIndex].url, {
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
            })
            this.dispatcher = this.connection
                ?.play(song)
                .on('finish', () => {
                    if (!this.loop) this.musicIndex = this.musicIndex + 1
                    this.playing = false
                    this.dispatcher = undefined
                    this.play()
                })
                .on('error', error => console.log(error))
            this.playing = true
            this.setVolume(this.volume)
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

    setLoop(loop: boolean) {
        this.loop = loop
    }
}
