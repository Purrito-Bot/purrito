export class DiceMaidenResult {

    success: boolean = false;

    rollerName: string = '';

    diceRolls: number[] = [];

    totalResult: number = 0;

    hasNatural20(): boolean {
        return this.success && this.diceRolls.filter(r => r === 20).length > 0
    }

    hasNatural1(): boolean {

        // TODO: So I got lost in the logic here. Naively, a D6 could be a 'natural 1' and I don't think that's a
        // thing. Additionally, if there are multiple rolls and only one of them is a 1 is that a big deal?
        // Leaving the method here for the discussion.
        return false
    }
}