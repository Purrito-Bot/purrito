import axios from 'axios'
import { Character } from './models/character'

export async function fetchCharacter(characterId: string) {
    const url = `https://www.dndbeyond.com/character/${characterId}/json`

    const response = await axios.get(url)
    const character: Character = JSON.parse(response.data)

    console.log(character.)
}

function calculateInitiative(character: Character): number {

    character.
}