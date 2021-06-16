import { GuildMember } from 'discord.js';
import config from '../config.json';
import { Command } from '../types/command';

/**
 * Check the user has permission to run a certain command
 * @param member the member to check permissions of
 * @param permissions permissions to be checked against
 */
export function checkUserCanRun(
    member: GuildMember,
    command: Command
): boolean {
    const { checkAdmin, roles, permissions, developerCommand } = command;

    // Firstly check if it's a developer command. If so,
    // only let developers perform this, and perform no other
    // checks
    if (developerCommand) {
        if (config.developerIds.includes(member.id)) {
            return true;
        } else {
            return false;
        }
    }

    let canRun = true;

    if (roles) {
        // Admins cannot bypass the role check here
        canRun = member.roles.cache.some((role) =>
            roles.includes(role.name.toLowerCase())
        );
    }

    // If canRun is still true, also check they have any required permissions
    if (permissions && canRun) {
        canRun = member.hasPermission(permissions, { checkAdmin });
    }

    return canRun;
}
