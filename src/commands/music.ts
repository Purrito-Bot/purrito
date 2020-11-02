import { Message, MessageEmbed } from 'discord.js'
import { botMusic } from '..'
import { Music } from '../models/music'
import MusicHelp from '../reference/musicHelp.json'
import {
    fetchSong,
    removeSong,
    changeVolume,
    skipSong,
    playing,
} from '../utils/musicUtils'

export async function music(message: Message, args: string[]) {
    let music = botMusic.get(message.guild!.id)

    if (!music) {
        music = new Music()
        botMusic.set(message.guild!.id, music)
    }

    switch (args[0]) {
        case 'join':
            try {
                await music.join(message.member?.voice.channel!)
                message.react('👍')
            } catch (error) {
                message.reply(new MessageEmbed({ description: error.message }))
            }
            break
        case 'leave':
            try {
                music.leave()
                message.react('👋')
            } catch (error) {
                message.reply(new MessageEmbed({ description: error.message }))
            }
            break
        case 'add':
            if (args[1]) {
                try {
                    const song = await fetchSong(
                        args[1],
                        music.songs.length,
                        message.author
                    )
                    music.addSong(song)
                    message.channel.send(
                        new MessageEmbed({
                            description: `🎶 ${song.title} added to the queue!`,
                        })
                    )
                } catch (error) {
                    message.reply(
                        new MessageEmbed({ description: error.message })
                    )
                }
            } else {
                message.channel.send(
                    new MessageEmbed({
                        description:
                            "🎶 Give me a YouTube link and I'll add it to the queue",
                    })
                )
            }
            break
        case 'remove':
            if (args[1]) {
                try {
                    const removedSong = await removeSong(music, args[1])
                    message.channel.send(
                        `${removedSong?.title} removed from the queue!`
                    )
                } catch (error) {
                    message.reply(
                        new MessageEmbed({ description: error.message })
                    )
                }
            } else {
                message.reply(
                    new MessageEmbed({
                        description:
                            'Use +music remove <number> to remove a song, or `music list` to see where it is in the list',
                    })
                )
            }
            break
        case 'list':
            if (music.songs.length > 0) {
                message.channel.send(music.createEmbed())
            } else {
                message.channel.send(
                    new MessageEmbed({
                        description:
                            '🎶 No songs in queue yet, try the `+music add` command',
                    })
                )
            }
            break
        case 'play':
            try {
                music.play()
                message.react('▶️')
            } catch (error) {
                message.reply(new MessageEmbed({ description: error.message }))
            }
            break
        case 'pause':
            try {
                music.pause()
                message.react('⏸️')
            } catch (error) {
                message.reply(new MessageEmbed({ description: error.message }))
            }
            break
        case 'reset':
            music.reset()
            break
        case 'volume':
            if (args[1]) {
                try {
                    await changeVolume(music, args[1])
                    message.reply(
                        new MessageEmbed({
                            description: `🎶 Volume set to ${args[1]}`,
                        })
                    )
                } catch (error) {
                    message.reply(
                        new MessageEmbed({ description: error.message })
                    )
                }
            } else {
                message.reply(
                    new MessageEmbed({
                        description: `🎶 Volume is ${music.volume}`,
                    })
                )
            }
            break
        case 'skip':
            if (args[1]) {
                try {
                    await skipSong(music, args[1])
                    message.reply(music.createEmbed())
                } catch (error) {
                    message.reply(
                        new MessageEmbed({ description: error.message })
                    )
                }
            } else {
                music.skip()
                message.reply(music.createEmbed())
            }
            break
        case 'loop':
            music.setLoop(!music.loop)
            message.channel.send(`Looping is now ${music.loop ? 'on' : 'off'}`)
            break
        case 'playing':
            try {
                const nowPlaying = await playing(music)
                message.reply(nowPlaying.createEmbed())
            } catch (error) {
                message.reply(new MessageEmbed({ description: error.message }))
            }
            break
        case 'help':
        default:
            message.channel.send(new MessageEmbed(MusicHelp))
            break
    }
}
