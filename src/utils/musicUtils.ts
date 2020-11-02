import { User } from 'discord.js'
import ytdl from 'ytdl-core'
import { Music } from '../models/music'
import { Song } from '../models/song'

export async function fetchSong(
    songUrl: string,
    queueLength: number,
    author: User
) {
    let songInfo: ytdl.videoInfo
    try {
        songInfo = await ytdl.getInfo(songUrl)
    } catch {
        throw Error('❌ Something went wrong when fetching your song.')
    }
    return new Song(
        songInfo.videoDetails.title,
        songInfo.videoDetails.video_url,
        songInfo.videoDetails.shortDescription,
        songInfo.videoDetails.lengthSeconds,
        songInfo.videoDetails.thumbnail?.thumbnails[0]?.url,
        queueLength + 1,
        author
    )
}

export async function removeSong(music: Music, songIndex: string) {
    const songToRemove = parseInt(songIndex)
    if (isNaN(songToRemove)) {
        throw Error(
            '⚠️ You must give a numerical value to remove to, see +music list to find out where the song is'
        )
    } else if (songToRemove > music.songs.length || songToRemove < 1) {
        throw Error("⚠️ I don't have a song at that number")
    } else {
        return music.removeSong(songToRemove)
    }
}

export async function changeVolume(music: Music, volume: string) {
    const newVolume = parseInt(volume)
    if (isNaN(newVolume) || newVolume > 10 || newVolume < 0) {
        throw Error('⚠️ Please give a value for your volume between 1 and 10')
    } else {
        music.setVolume(newVolume)
    }
}

export async function skipSong(music: Music, songIndex: string) {
    const skipTo = parseInt(songIndex)
    if (isNaN(skipTo)) {
        throw Error(
            'You must give a numerical value to skip to, see +music list to find out where your song is'
        )
    } else if (skipTo > music.songs.length || skipTo < 1) {
        throw Error("I don't have a song at that number")
    } else {
        music.skip(skipTo)
    }
}

export async function playing(music: Music) {
    if (music.playing) {
        const nowPlaying = music.songs.find(
            (song) => song.positionInQueue === music?.musicIndex
        )
        if (nowPlaying) {
            return nowPlaying
        } else {
            throw Error("I'm playing a song that's no longer in the queue!")
        }
    } else {
        throw Error(
            "▶️ I'm not playing anything right now, use `+music play` to hear me play"
        )
    }
}
