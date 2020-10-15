import { ValuedDescriptor } from "./valuedDescriptor";

export interface ItemType extends ValuedDescriptor {
    potentialMaterials: ValuedDescriptor[]
}