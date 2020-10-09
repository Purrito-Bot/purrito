import { Environment, Monster, Monsters } from '../../models/monster'

/**
 * Get only the monsters for a named environment
 * @param environment the environment to use
 */
export function filterMonstersByEnvironment(
    environment: Environment
): Monster[] {
    const monsters = Monsters.filter(monster =>
        monster.environments.includes(environment)
    )

    return monsters
}
