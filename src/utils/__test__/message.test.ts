import { Message, PermissionString } from 'discord.js'
import { Command } from '../../types/command'
import { checkUserCanRun, parseMessage } from '../message'

describe('Message Utils', () => {
    describe('parseMessage', () => {
        it('parses command and arguments', () => {
            const message: any = {
                content: '!help I need somebody',
            }

            const { command, args } = parseMessage(message)

            expect(command).toStrictEqual('help')
            expect(args).toStrictEqual(['I', 'need', 'somebody'])
        })
    })

    describe('checkUserCanRun', () => {
        class TestCommand extends Command {
            run(_: Message): void {}
            constructor({
                developerCommand = false,
                roles = undefined,
                permissions = undefined,
                checkAdmin = true,
            }: {
                developerCommand?: boolean
                roles?: string[]
                permissions?: PermissionString[]
                checkAdmin?: boolean
            }) {
                super({
                    developerCommand,
                    roles,
                    name: 'test',
                    description: 'description',
                    permissions,
                    checkAdmin,
                })
            }
        }
        it('return false when non-developer tries developer command', () => {
            const command = new TestCommand({ developerCommand: true })
            const member: any = { id: '1' }

            const result = checkUserCanRun(member, command)

            expect(result).toStrictEqual(false)
        })

        it('return true when a developer tries developer command', () => {
            const command = new TestCommand({ developerCommand: true })
            const member: any = { id: '235465385862758410' }

            const result = checkUserCanRun(member, command)

            expect(result).toStrictEqual(true)
        })

        it('return true when a developer tries developer command without required roles', () => {
            const command = new TestCommand({ developerCommand: true })
            const member: any = {
                id: '235465385862758410',
                roles: ['dummy role'],
            }

            const result = checkUserCanRun(member, command)

            expect(result).toStrictEqual(true)
        })

        it('return false to a user without the required role', () => {
            const command = new TestCommand({ roles: ['role'] })
            const member: any = {
                id: '235465385862758410',
                roles: { cache: [] },
            }

            const result = checkUserCanRun(member, command)

            expect(result).toStrictEqual(false)
        })

        it('return true to a user with the required role', () => {
            const command = new TestCommand({ roles: ['role'] })
            const member: any = {
                id: '235465385862758410',
                roles: { cache: [{ name: 'role' }] },
            }

            const result = checkUserCanRun(member, command)

            expect(result).toStrictEqual(true)
        })

        it('return true to a user with the required permission', () => {
            const hasPermission = jest.fn()
            const command = new TestCommand({ permissions: ['ADD_REACTIONS'] })
            const member: any = {
                id: '235465385862758410',
                roles: { cache: [{ name: 'role' }] },
                hasPermission,
            }

            hasPermission.mockReturnValueOnce(true)

            const result = checkUserCanRun(member, command)

            expect(result).toStrictEqual(true)
            expect(hasPermission).toHaveBeenCalledWith(['ADD_REACTIONS'], {
                checkAdmin: true,
            })
        })

        it('checks permissions even if user has correct role', () => {
            const hasPermission = jest.fn()
            const command = new TestCommand({
                roles: ['role'],
                permissions: ['ADD_REACTIONS'],
            })
            const member: any = {
                id: '235465385862758410',
                roles: { cache: [{ name: 'role' }] },
                hasPermission,
            }

            hasPermission.mockReturnValueOnce(true)

            const result = checkUserCanRun(member, command)

            expect(result).toStrictEqual(true)
            expect(hasPermission).toHaveBeenCalledWith(['ADD_REACTIONS'], {
                checkAdmin: true,
            })
        })

        it('passes check admin to hasPermission function', () => {
            const hasPermission = jest.fn()
            const command = new TestCommand({
                permissions: ['ADD_REACTIONS'],
                checkAdmin: false,
            })
            const member: any = {
                id: '235465385862758410',
                hasPermission,
            }

            hasPermission.mockReturnValueOnce(true)

            const result = checkUserCanRun(member, command)

            expect(result).toStrictEqual(true)
            expect(hasPermission).toHaveBeenCalledWith(['ADD_REACTIONS'], {
                checkAdmin: false,
            })
        })
    })
})
