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
        this.musicIndex = 1
    }

    createEmbed(): MessageEmbed {
        const embed = new MessageEmbed()

        embed.setTitle('Music Queue')
        embed.setDescription(
            'Welcome to the best music event on Discord, here is the set list:'
        )
        this.songs.forEach((song) => {
            if (this.musicIndex === song.positionInQueue) {
                embed.addField(
                    `${song.positionInQueue}. ${song.title} 🎵 ${
                        this.playing ? 'Now playing' : 'On the deck'
                    } 🎵`,
                    `Requested by ${song.requestingUser.username}`
                )
            } else {
                embed.addField(
                    `${song.positionInQueue}. ${song.title}`,
                    `Requested by ${song.requestingUser.username}`
                )
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
        if (voiceChannel) {
            try {
                this.voiceChannel = voiceChannel
                this.connection = await voiceChannel.join()
            } catch {
                throw Error('⚠️ I had trouble joining that channel.')
            }
        } else {
            throw Error('⚠️ Join a voice channel so I can join you')
        }
    }

    leave() {
        if (this.voiceChannel) {
            this.voiceChannel?.leave()
            this.voiceChannel = undefined
            this.connection = undefined
            this.dispatcher = undefined
            this.playing = false
            this.musicIndex = 1
        } else {
            throw Error(
                '⚠️ I\'m not in a voice channel, use `+music join` while in a voice channel and I\'ll join you'
            )
        }
    }

    pause() {
        if (this.playing && this.dispatcher) {
            this.dispatcher.pause()
            this.playing = false
        } else {
            throw Error("⚠️ I'm not playing anything, try `+music play`")
        }
    }

    addSong(song: Song) {
        this.songs.push(song)
    }

    removeSong(songIndex: number): Song | undefined {
        const toRemove = Number(songIndex - 1)
        const [song] = this.songs.splice(toRemove, 1)
        this.musicIndex = this.musicIndex - 1
        if (!this.playing && this.musicIndex < 1) {
            this.musicIndex = 1
        }

        this.songs.forEach((song) => {
            if (song.positionInQueue > toRemove) {
                song.positionInQueue = song.positionInQueue - 1
            }
        })

        return song
    }

    play() {
        if (this.songs.length === 0) {
            throw Error(
                '⚠️ The queue is empty right now, use `+music add` to add some songs'
            )
        } else if (!this.connection) {
            throw Error(
                "⚠️ I'm not currently in a voice channel, try `+music join` so I can play some music"
            )
        }

        let nowPlaying = this.songs.find(
            (song) => song.positionInQueue === this.musicIndex
        )
        if (!nowPlaying && this.songs.length > 0) {
            // If we've reached the end of the play list, and there are still songs in there, go back to the start
            this.musicIndex = 1
            nowPlaying = this.songs[0]
        } else if (!nowPlaying && this.songs.length === 0) {
            // If we reach the end of the playlist and the playlist is empty, leave the voice channel
            this.leave()
            return
        }

        if (this.dispatcher && !this.playing) {
            this.dispatcher.resume()
            this.playing = true
        } else if (this.playing) {
            logger.debug('play called when already playing')
        } else {
            const song = ytdl(nowPlaying!.url, {
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
                .on('error', (error) => console.log(error))
            this.playing = true
            this.setVolume(this.volume)
        }
    }

    reset() {
        this.songs = []
        this.voiceChannel?.leave()
        this.voiceChannel = undefined
        this.connection = undefined
        this.dispatcher = undefined
        this.playing = false
        this.musicIndex = 1
    }

    skip(songNumber?: number) {
        this.musicIndex = songNumber || this.musicIndex + 1

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
