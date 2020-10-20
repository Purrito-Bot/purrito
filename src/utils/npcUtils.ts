import { INPC, NPC } from '../models/npc'

/**
 * Generate a completely random NPC from the data set
 */
export function _generateNPC() {
    const npc: INPC = {
        appearance: ['Tall'],
        name: 'Jamie Jones',
        personality: ['Rude'],
        profession: 'Carpenter',
        race: 'Human',
    }

    return new NPC(npc)
}
