import { IItem, Item } from '../models/item'
import { MaterialType } from '../models/itemType'
import { ItemTypes } from '../reference'
import {
    Ages,
    Colours,
    Descriptors,
    ItemConditions,
    Metals, 
    Renowns,
    Sizes,
    Woods,
} from '../reference/item'
import {
    getRandomValueFromArray,
    getRandomValueFromWeightedArray,
} from './utils'

/**
 * Generate a completely random item using the reference data.
 */
export function _generateItem(): Item {
    const itemType = getRandomValueFromArray(ItemTypes)

    const item: IItem = {
        type: itemType,
        material: itemType.potentialMaterials
            ? generateMaterial(itemType.potentialMaterials)
            : undefined,
        colour: getRandomValueFromArray(Colours),
        descriptors: [
            getRandomValueFromArray(Descriptors),
            getRandomValueFromArray(Descriptors),
            getRandomValueFromArray(Descriptors),
        ],
        condition: getRandomValueFromWeightedArray(ItemConditions),
        size: getRandomValueFromWeightedArray(Sizes),
        renown: getRandomValueFromWeightedArray(Renowns),
        age: getRandomValueFromWeightedArray(Ages),
    }

    return new Item(item)
}

/**
 * Pick a random specific material from the data set
 * @param material the variety of material e.g. wood
 */
function generateMaterial(materialTypes: MaterialType[]): string {
    const material = getRandomValueFromWeightedArray(materialTypes).label

    let specificMaterial: string
    switch (material) {
        case 'METAL':
            specificMaterial = getRandomValueFromArray(Metals)
            break
        case 'WOOD':
            specificMaterial = getRandomValueFromArray(Woods)
            break
    }

    return specificMaterial
}
