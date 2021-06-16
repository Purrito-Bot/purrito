import { Collection, Message, PermissionString } from 'discord.js'
import { Purrito } from '../client'

interface ICommand {
    name: string
    description: string
    permissions?: PermissionString[]
    roles?: string[]
    /** A hidden command will not have it's help text displayed in server chats */
    hidden?: boolean
    /**
     * If set to false, any permission checks will not be overridden if the
     * user is an admin. Set to true by default
     */
    checkAdmin?: boolean
    /**
     * If set to true, only developers in the config.json will be able to run this command
     */
    developerCommand?: boolean
    /** Whether the command will have sub commands */
    subCommands?: boolean
}

export type CommandsCollection = Collection<string, Command>

/**
 * Represents a basic command.
 */
export abstract class Command implements ICommand {
    name: string
    description: string
    permissions?: PermissionString[]
    roles?: string[]
    hidden?: boolean
    developerCommand?: boolean
    checkAdmin: boolean = true
    subCommands?: boolean

    constructor(command: ICommand) {
        this.name = command.name
        this.description = command.description
        this.permissions = command.permissions
        this.roles = command.roles
        this.hidden = command.hidden
        this.developerCommand = command.developerCommand
        this.subCommands = command.subCommands
        if (command.checkAdmin !== undefined) {
            this.checkAdmin = command.checkAdmin
        }
    }

    /** The command that will be executed */
    abstract run(message: Message, args?: string[]): void

    /** Any initialisation the command needs to do */
    /* istanbul ignore next */
    init(client?: Purrito) {
        // Leave blank - can be overridden by subclasses
    }
}
