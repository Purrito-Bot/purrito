import { Message } from 'discord.js'
import { XPBudgets } from '../models/xpBudget'

const characterLevelNotProvided =
    'puurrrovide your character level e.g. +xpbudget 10'
const invalidCharacterLevel = (numberProvided: number) => {
    return `${numberProvided} not a valid level!`
}

/**
 * Given +xpbudget item, provide the user with the xp budget of a character of a given level
 * @param message
 * @param args
 */
export async function calculateXpBudget(message: Message, args?: string[]) {
    let messageToReturn: string

    let characterLevel: number | undefined
    let outputVariant: string | undefined

    // arg[0] - level of character
    // arg[1] - easy/medium/hard/deadly/daily
    if (Array.isArray(args) && args.length > 0) {
        if (args[0]) {
            characterLevel = parseInt(args[0])
        } else {
            // if no character level provided, provide some guiding info
            messageToReturn = characterLevelNotProvided
        }

        if (args[1]) outputVariant = args[1]
    }

    if (characterLevel && characterLevel !== NaN) {
        if (characterLevel > 20 || characterLevel < 1) {
            messageToReturn = invalidCharacterLevel(characterLevel)
        } else {
            const XPBudget = XPBudgets.find(
                xpBudget => xpBudget.level === characterLevel
            )!

            switch (outputVariant) {
                case 'easy':
                    messageToReturn = `An easy encounter for a level ${characterLevel} is ${XPBudget.easy.toString()}XP`
                    break
                case 'medium':
                    messageToReturn = `A medium encounter for a level ${characterLevel} is ${XPBudget.medium.toString()}XP`
                    break
                case 'hard':
                    messageToReturn = `A hard encounter for a level ${characterLevel} is ${XPBudget.hard.toString()}XP`
                    break
                case 'deadly':
                    messageToReturn = `A deadly encounter for a level ${characterLevel} is ${XPBudget.deadly.toString()}XP`
                    break
                case 'daily':
                default:
                    messageToReturn = `The daily budget of XP for a level ${characterLevel} is ${XPBudget.dailyBudget.toString()}XP`
            }
        }
    } else {
        // if character level is not a valid number, provide guiding info
        messageToReturn = characterLevelNotProvided
    }

    await message.channel.send(messageToReturn)
}
