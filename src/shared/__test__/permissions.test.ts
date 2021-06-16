import { Message, PermissionString } from 'discord.js';
import config from '../../config.json';
import { Command } from '../../types/command';
import { checkUserCanRun } from '../permissions';

describe('Message Utils', () => {
    describe('checkUserCanRun', () => {
        class TestCommand extends Command {
            run(_: Message): void {}
            constructor({
                developerCommand = false,
                roles = undefined,
                permissions = undefined,
                checkAdmin = true,
            }: {
                developerCommand?: boolean;
                roles?: string[];
                permissions?: PermissionString[];
                checkAdmin?: boolean;
            }) {
                super({
                    developerCommand,
                    roles,
                    name: 'test',
                    description: 'description',
                    permissions,
                    checkAdmin,
                });
            }
        }

        config.developerIds = ['2'];

        it('return false when non-developer tries developer command', () => {
            const command = new TestCommand({ developerCommand: true });
            const member: any = { id: '1' };

            const result = checkUserCanRun(member, command);

            expect(result).toStrictEqual(false);
        });

        it('return true when a developer tries developer command', () => {
            const command = new TestCommand({ developerCommand: true });
            const member: any = { id: '2' };

            const result = checkUserCanRun(member, command);

            expect(result).toStrictEqual(true);
        });

        it('return true when a developer tries developer command without required roles', () => {
            const command = new TestCommand({ developerCommand: true });
            const member: any = {
                id: '2',
                roles: ['dummy role'],
            };

            const result = checkUserCanRun(member, command);

            expect(result).toStrictEqual(true);
        });

        it('return false to a user without the required role', () => {
            const command = new TestCommand({ roles: ['role'] });
            const member: any = {
                roles: { cache: [] },
            };

            const result = checkUserCanRun(member, command);

            expect(result).toStrictEqual(false);
        });

        it('return true to a user with the required role', () => {
            const command = new TestCommand({ roles: ['role'] });
            const member: any = {
                roles: { cache: [{ name: 'role' }] },
            };

            const result = checkUserCanRun(member, command);

            expect(result).toStrictEqual(true);
        });

        it('return true to a user with the required permission', () => {
            const hasPermission = jest.fn();
            const command = new TestCommand({ permissions: ['ADD_REACTIONS'] });
            const member: any = {
                roles: { cache: [{ name: 'role' }] },
                hasPermission,
            };

            hasPermission.mockReturnValueOnce(true);

            const result = checkUserCanRun(member, command);

            expect(result).toStrictEqual(true);
            expect(hasPermission).toHaveBeenCalledWith(['ADD_REACTIONS'], {
                checkAdmin: true,
            });
        });

        it('checks permissions even if user has correct role', () => {
            const hasPermission = jest.fn();
            const command = new TestCommand({
                roles: ['role'],
                permissions: ['ADD_REACTIONS'],
            });
            const member: any = {
                roles: { cache: [{ name: 'role' }] },
                hasPermission,
            };

            hasPermission.mockReturnValueOnce(true);

            const result = checkUserCanRun(member, command);

            expect(result).toStrictEqual(true);
            expect(hasPermission).toHaveBeenCalledWith(['ADD_REACTIONS'], {
                checkAdmin: true,
            });
        });

        it('passes check admin to hasPermission function', () => {
            const hasPermission = jest.fn();
            const command = new TestCommand({
                permissions: ['ADD_REACTIONS'],
                checkAdmin: false,
            });
            const member: any = {
                hasPermission,
            };

            hasPermission.mockReturnValueOnce(true);

            const result = checkUserCanRun(member, command);

            expect(result).toStrictEqual(true);
            expect(hasPermission).toHaveBeenCalledWith(['ADD_REACTIONS'], {
                checkAdmin: false,
            });
        });
    });
});
