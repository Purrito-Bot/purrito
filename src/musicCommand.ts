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
                message.reply('Join a voice channel so I can join in')
            }
            break
        case 'leave':
            queue.voiceChannel?.leave()
            queue.voiceChannel = undefined
            break
        case 'add':
            const songInfo = await ytdl.getInfo(args[0])
            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            }
            queue.songs.push(song)
            message.channel.send(`${song.title} added to the queue!`)
            break
        case 'list':
            if(queue.songs.length > 0 ) {

                const embed = new MessageEmbed()
                embed.setTitle('Music Queue')
                queue.songs.forEach((song, index) =>
                embed.addField(`Song ${index}`, song.title)
                )
                message.reply(embed)
            } else {
                message.reply("No songs in queue yet")
            }
            break
        case 'play':
            if (queue.connection && queue.songs.length >= 1) {
                play(queue)
            }
            break
    }
}

function play(queue: SongQueue) {
    if (!queue.songs[0]) {
        queue.voiceChannel?.leave()
    } else {
        const song = ytdl(queue.songs[0].url)
        console.log(song)
        const dispatcher = queue.connection
            ?.play(song)
            .on('finish', () => {
                queue.songs.shift()
                play(queue)
            })
            .on('error', error => console.log(error))
    }
}
