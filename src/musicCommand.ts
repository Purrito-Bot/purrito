import { Message, MessageEmbed } from 'discord.js'
import ytdl from 'ytdl-core'
import { SongQueue } from './models/songQueue'

function parseMessage(message: Message): [string, string[]] {
    const args = message.content
        .slice('~'.length)
        .trim()
        .split(/ +/g)
    const command = args.shift()!.toLowerCase()

    return [command, args]
}

export async function musicCommand(message: Message, queue: SongQueue) {
    const [command, args] = parseMessage(message)

    switch (command) {
        case 'join':
            if (message.member?.voice.channel) {
                queue.connection = await message.member?.voice.channel.join()
                queue.voiceChannel = message.member.voice.channel
            } else {
                message.reply('Join a voice channel so I can join you')
            }
            break
        case 'leave':
            if (queue.voiceChannel) {
                queue.voiceChannel.leave()
                queue.voiceChannel = undefined
                queue.connection = undefined
                queue.dispatcher = undefined
                queue.playing = false
            } else {
                message.reply(
                    "I'm not in a voice channel, use `+join` while in a voice channel and I'll join you"
                )
            }
            break
        case 'add':
            if (args[0]) {
                const songInfo = await ytdl.getInfo(args[0])
                const song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                }
                queue.songs.push(song)
                message.channel.send(`${song.title} added to the queue!`)
            } else {
                message.reply(
                    "Give me a YouTube link and I'll add it to the queue"
                )
            }
            break
        case 'list':
            if (queue.songs.length > 0) {
                const embed = new MessageEmbed()
                embed.setTitle('Music Queue')
                queue.songs.forEach((song, index) =>
                    embed.addField(`Song ${index}`, song.title)
                )
                message.reply(embed)
            } else {
                message.reply('No songs in queue yet, try the `+add` command')
            }
            break
        case 'play':
            if (queue.songs.length === 0) {
                message.reply(
                    'The queue is empty right now, use `+add` to add some songs'
                )
            } else if (!queue.connection) {
                message.reply(
                    "I'm not currently in a voice channel, try `+join` so I can play some music"
                )
            } else {
                play(queue, message)
            }
            break
        case 'pause':
            if (queue.playing && queue.dispatcher) {
                queue.dispatcher.pause()
                queue.playing = false
            } else {
                message.reply("I'm not playing anything, try `+play`")
            }
            break
        case 'reset':
            queue.songs = []
            if (queue.dispatcher) {
                queue.dispatcher.pause()
                queue.playing = false
            }
            break
    }
}

async function play(queue: SongQueue, message: Message) {
    if (!queue.songs[0]) {
        queue.voiceChannel?.leave()
        queue.voiceChannel = undefined
        queue.dispatcher = undefined
        queue.connection = undefined
        queue.playing = false
    } else if (queue.dispatcher && !queue.playing) {
        queue.dispatcher.resume()
        queue.playing = true
    } else if (queue.playing) {
        message.reply("I'm already playing")
    } else {
        const song = ytdl(queue.songs[0].url, { filter: 'audioonly' })
        const dispatcher = queue.connection
            ?.play(song)
            .on('finish', () => {
                //queue.songs.shift()
                //play(queue, message)
            })
            .on('error', error => console.log(error))
        queue.dispatcher = dispatcher
        queue.playing = true
    }
}
