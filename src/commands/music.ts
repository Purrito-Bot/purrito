import { Message, MessageEmbed } from 'discord.js'
import ytdl from 'ytdl-core'
import { botMusic } from '..'
import { Music } from '../models/music'

export async function music(message: Message, args: string[]) {
    let music = botMusic.get(message.guild!.id)

    if (!music) {
        music = new Music()
        botMusic.set(message.guild!.id, music)
    }

    switch (args[0]) {
        case 'join':
            if (message.member?.voice.channel) {
                await music.join(message.member.voice.channel)
            } else {
                message.reply('Join a voice channel so I can join you')
            }
            break
        case 'leave':
            if (music.voiceChannel) {
                music.leave()
            } else {
                message.reply(
                    "I'm not in a voice channel, use `+music join` while in a voice channel and I'll join you"
                )
            }
            break
        case 'add':
            if (args[1]) {
                const songInfo = await ytdl.getInfo(args[1])
                const song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                }
                music.addSong(song)
                message.channel.send(`${song.title} added to the queue!`)
            } else {
                message.reply(
                    "Give me a YouTube link and I'll add it to the queue"
                )
            }
            break
        case 'list':
            if (music.songs.length > 0) {
                const embed = new MessageEmbed()
                embed.setTitle('Music Queue')
                music.songs.forEach((song, index) =>
                    embed.addField(
                        `Song ${index}${
                            music?.musicIndex === index ? ' - On the deck' : ''
                        }`,
                        song.title
                    )
                )
                message.reply(embed)
            } else {
                message.reply(
                    'No songs in queue yet, try the `+music add` command'
                )
            }
            break
        case 'play':
            if (music.songs.length === 0) {
                message.reply(
                    'The queue is empty right now, use `+music add` to add some songs'
                )
            } else if (!music.connection) {
                message.reply(
                    "I'm not currently in a voice channel, try `+music join` so I can play some music"
                )
            } else {
                music.play()
            }
            break
        case 'pause':
            if (music.playing && music.dispatcher) {
                music.dispatcher.pause()
                music.playing = false
            } else {
                message.reply("I'm not playing anything, try `+music play`")
            }
            break
        case 'reset':
            music.reset()
            break
        case 'volume':
            if (args[1]) {
                const newVolume = parseInt(args[1])
                if (isNaN(newVolume)) {
                    message.reply(
                        'Please give a value for your volume between 1 and 10'
                    )
                } else if (newVolume > 10 || newVolume < 0) {
                    message.reply(
                        'Please give a value for your volume between 1 and 10'
                    )
                } else {
                    music.setVolume(newVolume)
                }
            } else {
                message.reply(`Volume is set to ${music.volume}`)
            }
            break
        case 'skip':
            if (args[1]) {
                const skipTo = parseInt(args[1])
                if (isNaN(skipTo)) {
                    message.reply(
                        'You must give a numerical value to skip to, see `+music list` to find out where your song is'
                    )
                } else if (skipTo > music.songs.length || skipTo < 0) {
                    message.reply("I don't have a song at that number")
                } else {
                    music.skip(skipTo)
                }
            } else {
                music.skip()
            }
            break
    }
}
