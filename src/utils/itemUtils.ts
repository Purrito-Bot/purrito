import { Ages } from '../const/ages'
import { Colours } from '../const/colours'
import { Conditions } from '../const/conditions'
import { Descriptors } from '../const/descriptors'
import { ItemTypes } from '../const/itemTypes'
import { Renowns } from '../const/renowns'
import { Sizes } from '../const/sizes'
import { IItem, Item } from '../models/item'
import { Material, MaterialType } from '../models/itemType'
import { createdWeightedList, getRandomValueFromArray } from './utils'
import Metals from '../reference/item/metals.json'
import Woods from '../reference/item/woods.json'

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
        condition: getRandomValueFromArray(createdWeightedList(Conditions)),
        size: getRandomValueFromArray(createdWeightedList(Sizes)),
        renown: getRandomValueFromArray(createdWeightedList(Renowns)),
        age: getRandomValueFromArray(createdWeightedList(Ages)),
    }

    return new Item(item)
}

/**
 * Pick a random specific material from the data set
 * @param material the variety of material e.g. wood
 */
function generateMaterial(materialTypes: MaterialType[]): string {
    const material = getRandomValueFromArray(createdWeightedList(materialTypes))
        .label

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
