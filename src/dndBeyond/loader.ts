import axios from 'axios';
import * as fs from 'fs';
import { Character } from './models/character';

/*
 * Functions for parsing the D&D Beyond Character JSON.
 * Heavily modified for our purposes and typeified from a script by Robin Kuiper.
 * 
 * Original here:
 * https://github.com/RobinKuiper/Roll20APIScripts/blob/master/BeyondImporter_5eOGL/BeyondImporter.js
 */

const _ABILITIES = new Map([[1, 'STR'], [2, 'DEX'], [3, 'CON'], [4, 'INT'], [5, 'WIS'], [6, 'CHA']]);
const _ABILITY = new Map([['STR', 'strength'], ['DEX', 'dexterity'], ['CON', 'constitution'], ['INT', 'intelligence'], ['WIS', 'wisdom'], ['CHA', 'charisma']]);
const alignments = ['', 'Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];
const strength_skills = ['athletics'];
const dexterity_skills = ['acrobatics', 'sleight_of_hand', 'stealth'];
const intelligence_skills = ['arcana', 'history', 'investigation', 'nature', 'religion'];
const wisdom_skills = ['animal_handling', 'insight', 'medicine', 'perception', 'survival'];
const charisma_skills = ['deception', 'intimidation', 'performance', 'persuasion']
const saving_throws = ['strength_save', 'dexterity_save', 'constitution_save', 'intelligence_save', 'wisdom_save', 'charisma_save'];
const all_skills = strength_skills.concat(dexterity_skills, intelligence_skills, wisdom_skills, charisma_skills);

// these class features are hidden
const silent_class_features = [
    'Spellcasting',
    'Bonus Proficiency',
    'Ability Score Improvement',
    'Bonus Cantrip',
    'Proficiencies',
    'Hit Points',
    'Pact Magic',
    'Expanded Spell List',
    'Druidic',
    'Expertise',
    'Oath Spells'
];

// these are added by showing the selected options as class features
const option_class_features = [
    'Maneuvers',
    'Fighting Style',
    'Divine Domain',
    'Arcane Tradition',
    'Otherworldly Patron',
    'Ranger Archetype',
    'Druid Circle',
    'Sorcerous Origin',
    'Monastic Tradition',
    'Bardic College',
    'Roguish Archetype',
    'Sacred Oath',
    'Martial Archetype'
];

const weapons = ['Club', 'Dagger', 'Greatclub', 'Handaxe', 'Javelin', 'Light Hammer', 'Mace', 'Quarterstaff', 'Sickle', 'Spear', 'Crossbow, Light', 'Dart', 'Shortbow', 'Sling', 'Battleaxe', 'Flail', 'Glaive', 'Greataxe', 'Greatsword', 'Halberd', 'Lance', 'Longsword', 'Maul', 'Morningstar', 'Pike', 'Rapier', 'Scimitar', 'Shortsword', 'Trident', 'War Pick', 'Warhammer', 'Whip', 'Blowgun', 'Crossbow, Hand', 'Crossbow, Heavy', 'Longbow', 'Net'];



//return an array of objects according to key, value, or key and value matching, optionally ignoring objects in array of names
function getObjects(obj: any, key: string, val: any, except: any[] | null = null) {
    except = except || [];
    let objects: any[] = [];
    for (let i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            if (except.indexOf(i) != -1) {
                continue;
            }
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i == key && obj[i] == val || i == key && val == '') { //
                objects.push(obj);
            } else if (obj[i] == val && key == '') {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) == -1) {
                    objects.push(obj);
                }
            }
    }
    return objects;
}

const blankIfNull = (input: string) => {
    return (input === null) ? "" : input;
}

function log(log: string) {
    // console.log(log);
}


function replaceChars(text: string) {
    text = text.replace('\&rsquo\;', '\'').replace('\&mdash\;', '—').replace('\ \;', ' ').replace('\&hellip\;', '…');
    text = text.replace('\&nbsp\;', ' ');
    text = text.replace('\û\;', 'û').replace('’', '\'').replace(' ', ' ');
    text = text.replace(/<li[^>]+>/gi, '• ').replace(/<\/li>/gi, '');
    text = text.replace(/\r\n(\r\n)+/gm, '\r\n');
    return text;
};

function getRepeatingRowId(section: string, attribute: string, matchValue: string, index: number): string {

    const result = getRepeatingRowIds(section, attribute, matchValue);
    return result == null && index >= 0 ? generateRowID() : result[index];
}

function getRepeatingRowIds(section: string, attribute: string, matchValue: string): string[] {
    let ids: string[] = [];
    /*
    let matches = findObjs({ type: 'attribute', characterid: object.id })
        .filter((attr) => {
            return attr.get('name').indexOf('repeating_' + section) !== -1 && attr.get('name').indexOf(attribute) !== -1 && attr.get('current') == matchValue;
        });
    for (let i in matches) {
        let row = matches[i].get('name').replace('repeating_' + section + '_', '').replace('_' + attribute, '');
        ids.push(row);
    }
    */
    if (ids.length == 0) {
        ids.push(generateRowID());
    }

    return ids;
}

function createRepeatingTrait(object: any, trait: any, options: any | null = null) {
    options = options || {};

    let opts = {
        index: 0,
        itemid: ''
    };
    Object.assign(opts, options);

    let row = getRepeatingRowId('traits', 'name', trait.name, opts.index);

    let attributes: any = {}
    attributes["repeating_traits_" + row + "_name"] = trait.name;
    attributes["repeating_traits_" + row + "_source"] = trait.source;
    attributes["repeating_traits_" + row + "_source_type"] = trait.source_type;
    attributes["repeating_traits_" + row + "_description"] = replaceChars(trait.description);
    attributes["repeating_traits_" + row + "_options-flag"] = '0';

    return attributes;
};

function createRepeatingAttack(object: any, attack: any, options: any | null = null) {
    options = options || {};

    let opts = {
        index: 0,
        itemid: ''
    };
    Object.assign(opts, options);

    let attackrow = getRepeatingRowId('attack', 'atkname', attack.name, opts.index);

    let attackattributes: any = {};
    attackattributes["repeating_attack_" + attackrow + "_options-flag"] = '0';
    attackattributes["repeating_attack_" + attackrow + "_atkname"] = attack.name;
    attackattributes["repeating_attack_" + attackrow + "_itemid"] = opts.itemid;
    attackattributes["repeating_attack_" + attackrow + "_atkflag"] = '{{attack=1}}';
    attackattributes["repeating_attack_" + attackrow + "_atkattr_base"] = '@{' + attack.attack.attribute + '_mod}';
    attackattributes["repeating_attack_" + attackrow + "_atkprofflag"] = '(@{pb})';
    attackattributes["repeating_attack_" + attackrow + "_atkmagic"] = attack.magic;
    attackattributes["repeating_attack_" + attackrow + "_atkrange"] = attack.range;
    attackattributes["repeating_attack_" + attackrow + "_atkmod"] = attack.attack.mod == null ? '' : attack.attack.mod;
    attackattributes["repeating_attack_" + attackrow + "_atkcritrange"] = attack.critrange == null ? '' : attack.critrange;

    attackattributes["repeating_attack_" + attackrow + "_dmgflag"] = '{{damage=1}} {{dmg1flag=1}}';
    attackattributes["repeating_attack_" + attackrow + "_dmgbase"] = typeof attack.damage.diceString == 'string' ? attack.damage.diceString + '' : '';
    attackattributes["repeating_attack_" + attackrow + "_dmgattr"] = (attack.damage.attribute === '0') ? '0' : '@{' + attack.damage.attribute + '_mod}';
    attackattributes["repeating_attack_" + attackrow + "_dmgtype"] = attack.damage.type;
    attackattributes["repeating_attack_" + attackrow + "_dmgcustcrit"] = attack.damage.diceString;
    attackattributes["repeating_attack_" + attackrow + "_dmgmod"] = attack.damage.mod == null ? '' : attack.damage.mod;

    if (attack.damage2 != null) {
        attackattributes["repeating_attack_" + attackrow + "_dmg2flag"] = '{{damage=1}} {{dmg2flag=1}}';
        attackattributes["repeating_attack_" + attackrow + "_dmg2base"] = attack.damage2.diceString;
        attackattributes["repeating_attack_" + attackrow + "_dmg2attr"] = (attack.damage2.attribute === '0') ? '0' : '@{' + attack.damage2.attribute + '_mod}';
        attackattributes["repeating_attack_" + attackrow + "_dmg2type"] = attack.damage2.type;
        attackattributes["repeating_attack_" + attackrow + "_dmg2custcrit"] = attack.damage2.diceString;
    }

    attackattributes["repeating_attack_" + attackrow + "_atk_desc"] = '';//replaceChars(attack.description);

    return attackattributes;
}

let class_spells: any[] = [];
let spellAttacks: any[] = [];
let object: any = null;

//  jack of all trades feature in input, or undefined
let jack_feature: any = undefined;

var spellTargetInAttacks = true;

export async function loadCharacterFromId(id: string): Promise<Character> {

    // using the firefox user-agent. custom UAs tend to get blocked.
    const config = {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0' }
    }

    const response = await axios.get(`https://www.dndbeyond.com/character/${id}/json`, config);
    return parseCharacter(response.data);
}

export async function loadCharacterFromFilePath(filepath: string): Promise<Character> {
    const file = await fs.promises.readFile(filepath);
    const json = JSON.parse(file.toString())
    return parseCharacter(json);
}

export function parseCharacter(data: any): Character {

    let character = data;

    class_spells = [];

    // these are automatically sorted into attributes that are written individually, in alphabetical order
    // and other attributes that are then written as a bulk write, but all are written before repeating_attributes
    let single_attributes: any = {};

    single_attributes["id"] = data["id"];
    single_attributes["name"] = data["name"];

    // these are written in one large write once everything else is written
    // NOTE: changing any stats after all these are imported would create a lot of updates, so it is
    // good that we write these when all the stats are done
    let repeating_attributes: any = {};

    object = null;

    // base class, if set
    if (character.classes && (character.classes.length > 0)) {
        Object.assign(single_attributes, {
            'class': character.classes[0].definition.name,
            'subclass': character.classes[0].subclassDefinition == null ? '' : character.classes[0].subclassDefinition.name,
            'base_level': character.classes[0].level
        });
    }

    // Make Speed String
    let weightSpeeds = character.race.weightSpeeds;
    if (weightSpeeds == null) {
        weightSpeeds = {
            "normal": {
                "walk": 30,
                "fly": 0,
                "burrow": 0,
                "swim": 0,
                "climb": 0
            }
        };
    }

    let speedMods = getObjects(character.modifiers, 'subType', 'speed');
    if (speedMods != null) {
        speedMods.forEach((speedMod) => {
            // REVISIT: what item is this for?  boots of striding and springing use set: innate-speed-walking and Loadstone uses bonus: speed
            // so maybe this is for some feat or class feature? we could scope the search to not the whole character to clarify this
            if (speedMod.type == 'set') {
                weightSpeeds.normal.walk = (speedMod.value > weightSpeeds.normal.walk ? speedMod.value : weightSpeeds.normal.walk);
            }
        });
    }

    speedMods = getObjects(character.modifiers, 'subType', 'innate-speed-flying');
    if (speedMods != null) {
        speedMods.forEach((speedMod) => {
            if (speedMod.type == 'set' && speedMod.id.indexOf('spell') == -1) {
                if (speedMod.value == null) speedMod.value = weightSpeeds.normal.walk;
                weightSpeeds.normal.fly = (speedMod.value > weightSpeeds.normal.fly ? speedMod.value : weightSpeeds.normal.fly);
            }
        });
    }

    speedMods = getObjects(character.modifiers, 'subType', 'innate-speed-swimming');
    if (speedMods != null) {
        speedMods.forEach((speedMod) => {
            if (speedMod.type == 'set' && speedMod.id.indexOf('spell') == -1) {
                if (speedMod.value == null) speedMod.value = weightSpeeds.normal.walk;
                weightSpeeds.normal.swim = (speedMod.value > weightSpeeds.normal.swim ? speedMod.value : weightSpeeds.normal.swim);
            }
        });
    }

    speedMods = getObjects(character.modifiers, 'subType', 'innate-speed-climbing');
    if (speedMods != null) {
        speedMods.forEach((speedMod) => {
            if (speedMod.type == 'set' && speedMod.id.indexOf('spell') == -1) {
                if (speedMod.value == null) speedMod.value = weightSpeeds.normal.walk;
                weightSpeeds.normal.climb = (speedMod.value > weightSpeeds.normal.climb ? speedMod.value : weightSpeeds.normal.climb);
            }
        });
    }

    speedMods = getObjects(character.modifiers, 'subType', 'unarmored-movement');
    if (speedMods != null) {
        speedMods.forEach((speedMod) => {
            if (speedMod.type == 'bonus') {
                speedMod.value = isNaN(weightSpeeds.normal.walk + speedMod.value) ? 0 : speedMod.value;
                weightSpeeds.normal.walk += speedMod.value;
                if (weightSpeeds.normal.fly > 0) weightSpeeds.normal.fly += speedMod.value;
                if (weightSpeeds.normal.swim > 0) weightSpeeds.normal.swim += speedMod.value;
                if (weightSpeeds.normal.climb > 0) weightSpeeds.normal.climb += speedMod.value;
            }
        });
    }

    speedMods = getObjects(character.modifiers, 'subType', 'speed');
    if (speedMods != null) {
        speedMods.forEach((speedMod) => {
            if (speedMod.type == 'bonus') {
                speedMod.value = isNaN(weightSpeeds.normal.walk + speedMod.value) ? 0 : speedMod.value;
                weightSpeeds.normal.walk += speedMod.value;
                if (weightSpeeds.normal.fly > 0) weightSpeeds.normal.fly += speedMod.value;
                if (weightSpeeds.normal.swim > 0) weightSpeeds.normal.swim += speedMod.value;
                if (weightSpeeds.normal.climb > 0) weightSpeeds.normal.climb += speedMod.value;
            }
        });
    }

    let speed = weightSpeeds.normal.walk + 'ft.';
    for (let key in weightSpeeds.normal) {
        if (key !== 'walk' && weightSpeeds.normal[key] !== 0) {
            speed += ', ' + key + ' ' + weightSpeeds.normal[key] + 'ft.';
        }
    }

    let weapon_critical_range = 20;
    let critical_range = 20;

    // Languages
    let languages = getObjects(character, 'type', 'language');
    let langs: any[] = [];
    if (languages != null) {
        languages.forEach((language) => {
            langs.push(language.friendlySubtypeName);
        });
    }

    let row = getRepeatingRowIds('proficiencies', 'prof_type', 'LANGUAGE')[0];

    let attributes: any = {};
    attributes[`repeating_proficiencies_${row}_name`] = langs.join(', ');
    attributes[`repeating_proficiencies_${row}_prof_type`] = 'LANGUAGE';
    attributes[`repeating_proficiencies_${row}_options-flag`] = '0';

    Object.assign(repeating_attributes, attributes);

    // Background Feature
    if (character.background.definition != null) {
        let btrait = {
            name: character.background.definition.featureName,
            description: replaceChars(character.background.definition.featureDescription),
            source: 'Background',
            source_type: character.background.definition.name
        }

        let attrs = createRepeatingTrait(object, btrait);
        Object.assign(repeating_attributes, attrs);
    }
    // Custom Background Feature
    if (character.background.customBackground != null) {
        if (character.background.customBackground.featuresBackground != null) {
            let btrait = {
                name: character.background.customBackground.featuresBackground.featureName,
                description: replaceChars(character.background.customBackground.featuresBackground.featureDescription),
                source: 'Background',
                source_type: character.background.customBackground.name
            };

            let attrs = createRepeatingTrait(object, btrait);
            Object.assign(repeating_attributes, attrs);
        }
    }
    // Feats
    character.feats.forEach((feat: any, fi: any) => {
        let t = {
            name: feat.definition.name,
            description: replaceChars(feat.definition.description),
            source: 'Feat',
            source_type: feat.definition.name
        };

        let attrs = createRepeatingTrait(object, t, fi);
        Object.assign(repeating_attributes, attrs);
    });
    // Race Features
    if (character.race.racialTraits != null) {
        let ti = 0;
        character.race.racialTraits.forEach((trait: any) => {
            if (['Languages', 'Darkvision', 'Superior Darkvision', 'Skills', 'Ability Score Increase', 'Feat', 'Age', 'Alignment', 'Size', 'Speed', 'Skill Versatility', 'Dwarven Combat Training', 'Keen Senses', 'Elf Weapon Training', 'Extra Language', 'Tool Proficiency'].indexOf(trait.definition.name) !== -1) {
                return;
            }

            let description = '';
            if (trait.options != null) {
                trait.options.forEach((option: any) => {
                    description += option.name + '\n';
                    description += (option.description !== '') ? option.description + '\n\n' : '\n';
                });
            }

            description += trait.definition.description;

            let t = {
                name: trait.definition.name,
                description: replaceChars(description),
                source: 'Race',
                source_type: character.race.fullName
            };

            let attrs = createRepeatingTrait(object, t, ti);
            Object.assign(repeating_attributes, attrs);

            let spells = getFeatureSpells(character, trait.id, 'race');
            spells.forEach((spell) => {
                const spellCastingAbilityId = <number>spell.spellCastingAbilityId;
                spell.spellCastingAbility = _ABILITIES.get(spellCastingAbilityId);
                class_spells.push(spell);
            });

            ti++;
        });
    }

    // Handle (Multi)Class Features
    let multiclass_level = 0;
    let total_level = 0;
    let monk_level = 0;

    let multiclasses: any = {};
    character.classes.forEach((current_class: any, i: number) => {
        total_level += current_class.level;

        if (!current_class.isStartingClass) {
            multiclasses['multiclass' + i + '_flag'] = '1';
            multiclasses['multiclass' + i + '_lvl'] = current_class.level;
            multiclasses['multiclass' + i] = current_class.definition.name.toLowerCase();
            multiclasses['multiclass' + i + '_subclass'] = current_class.subclassDefinition == null ? '' : current_class.subclassDefinition.name;
            multiclass_level += current_class.level;
        }

        // Set Pact Magic as class resource
        if (current_class.definition.name.toLowerCase() === 'warlock') {
            let attributes: any = {}
            attributes['other_resource_name'] = 'Pact Magic';
            attributes['other_resource_max'] = getPactMagicSlots(current_class.level);
            attributes['other_resource'] = getPactMagicSlots(current_class.level);
            Object.assign(single_attributes, attributes);
        }

        if (current_class.definition.name == 'Monk') monk_level = current_class.level;

        if (current_class.definition.name.toLowerCase() === 'fighter' && current_class.subclassDefinition != null) {
            if (current_class.subclassDefinition.name.toLowerCase() == 'champion') {
                current_class.subclassDefinition.classFeatures.forEach((feature: any, i: number) => {
                    if (feature.id == 215 && current_class.level >= feature.requiredLevel) { // improved critical
                        critical_range = Math.min(19, critical_range);
                    }
                    if (feature.id == 218 && current_class.level >= feature.requiredLevel) {
                        critical_range = Math.min(18, critical_range);
                    }
                });
            }
        }

        let ti = 0;
        current_class.definition.classFeatures.forEach((trait: any) => {
            if (silent_class_features.indexOf(trait.name) !== -1) {
                return;
            }
            if (option_class_features.indexOf(trait.name) !== -1) {
                ti = importClassOptions(repeating_attributes, trait, current_class, character.options.class, ti);
                return;
            }
            if (trait.requiredLevel > current_class.level) return;

            if (trait.name.includes('Jack of All Trades')) {
                jack_feature = trait;
            }

            let description = '';

            description += trait.description;

            let t = {
                name: trait.name,
                description: replaceChars(description),
                source: 'Class',
                source_type: current_class.definition.name
            };

            Object.assign(repeating_attributes, createRepeatingTrait(object, t, ti));

            let spells = getFeatureSpells(character, trait.id, 'class');
            spells.forEach((spell) => {
                spell.spellCastingAbility = _ABILITIES.get(spell.spellCastingAbilityId);
                class_spells.push(spell);
            });

            if (trait.name == 'Metamagic') {
                character.choices.class.forEach((option: any) => {
                    if (option.type == 3 && (option.optionValue >= 106 && option.optionValue <= 113)) {
                        let items = getObjects(option.options, 'id', option.optionValue);

                        if (items.length > 0) {
                            const item = items[0];
                            let o = {
                                name: item.label,
                                description: item.description,
                                source: 'Class',
                                source_type: current_class.definition.name
                            };

                            Object.assign(repeating_attributes, createRepeatingTrait(object, o));
                        }
                    }
                });
            }

            ti++;
        });

        if (current_class.subclassDefinition != null) {
            let ti = 0;
            current_class.subclassDefinition.classFeatures.forEach((trait: any) => {
                if (silent_class_features.indexOf(trait.name) !== -1) {
                    return;
                }
                if (option_class_features.indexOf(trait.name) !== -1) {
                    ti = importClassOptions(repeating_attributes, trait, current_class, character.options.class, ti);
                    return;
                }
                if (trait.requiredLevel > current_class.level) return;

                if (trait.name.includes('Jack of All Trades')) {
                    jack_feature = trait;
                }

                let description = '';

                description += trait.description;

                let t = {
                    name: trait.name,
                    description: replaceChars(description),
                    source: 'Class',
                    source_type: current_class.definition.name
                }

                Object.assign(repeating_attributes, createRepeatingTrait(object, t, ti));

                let spells = getFeatureSpells(character, trait.id, 'class');
                spells.forEach((spell) => {
                    spell.spellCastingAbility = _ABILITIES.get(spell.spellCastingAbilityId);
                    class_spells.push(spell);
                });

                ti++;
            });
        }


        // Class Spells
        for (let i in character.classSpells) {
            let spells = character.classSpells[i];
            if (character.classSpells[i].characterClassId == current_class.id) {
                character.classSpells[i].spells.forEach((spell: any) => {
                    spell.spellCastingAbility = _ABILITIES.get(current_class.definition.spellCastingAbilityId);
                    class_spells.push(spell);
                });
            }
        }
    });
    Object.assign(single_attributes, multiclasses);

    // Import Character Inventory
    let hasArmor = false;
    // accumulate unique fighting styles selected
    let fightingStylesSelected = new Set()
    let fightingStyles = getObjects(character.classes, 'name', 'Fighting Style');
    fightingStyles.forEach((fS) => {
        let fsOpts = getObjects(character.choices, 'componentId', fS.id);
        fsOpts.forEach((fsOpt) => {
            if (fsOpt.optionValue != null) {
                let selOpts = getObjects(fsOpt.options, 'id', fsOpt.optionValue);
                selOpts.forEach((selOpt) => {
                    fightingStylesSelected.add(selOpt.label)
                });
            }
        });
    });

    const inventory = character.inventory;
    let prevAdded: string[] = [];
    if (inventory != null) {
        let shieldEquipped = false;
        inventory.forEach((item: any, i: number) => {
            if (item.definition.type == 'Shield' && item.equipped) {
                shieldEquipped = true;
            }
        });
        inventory.forEach((item: any, i: number) => {
            log('beyond: found inventory item ' + item.definition.name);
            let paIndex = prevAdded.filter((pAdded) => { return pAdded == item.definition.name; }).length;
            let row = getRepeatingRowId('inventory', 'itemname', item.definition.name, paIndex);
            prevAdded.push(item.definition.name);

            let attributes: any = {};
            attributes["repeating_inventory_" + row + "_itemname"] = item.definition.name;
            attributes["repeating_inventory_" + row + "_equipped"] = (item.equipped) ? '1' : '0';
            attributes["repeating_inventory_" + row + "_itemcount"] = item.quantity;
            attributes["repeating_inventory_" + row + "_itemweight"] = (item.definition.bundleSize != 0 ? item.definition.weight / item.definition.bundleSize : item.definition.weight);
            attributes["repeating_inventory_" + row + "_itemcontent"] = replaceChars(item.definition.description);
            let _itemmodifiers = 'Item Type: ' + item.definition.type;
            if (typeof item.definition.damage === 'object' && item.definition.type !== 'Ammunition') {
                let properties = '';
                let finesse = false;
                let twohanded = false;
                let ranged = false;
                let hasOffhand = false;
                let isOffhand = false;
                let versatile = false;
                let versatileDice = '';
                item.definition.properties.forEach((prop: any) => {
                    if (prop.name == 'Two-Handed') {
                        twohanded = true;
                    }
                    if (prop.name == 'Range') {
                        ranged = true;
                    }
                    if (prop.name == 'Finesse') {
                        finesse = true;
                    }
                    if (prop.name == 'Versatile') {
                        versatile = true;
                        versatileDice = prop.notes;
                    }

                    properties += prop.name + ', ';
                });

                let cv = getObjects(character.characterValues, 'valueTypeId', item.entityTypeId);
                cv.forEach((v) => {
                    if (v.typeId == 18 && v.value === true) {
                        hasOffhand = true;
                        if (v.valueId == item.id) {
                            isOffhand = true;
                        }
                    }
                });

                attributes["repeating_inventory_" + row + "_itemproperties"] = properties;
                attributes["repeating_inventory_" + row + "_hasattack"] = '0';
                _itemmodifiers = 'Item Type: ' + item.definition.attackType + ' ' + item.definition.filterType + (item.definition.damage != null ? ', Damage: ' + item.definition.damage.diceString : '') + ', Damage Type: ' + item.definition.damageType + ', Range: ' + item.definition.range + '/' + item.definition.longRange;

                let magic = 0;
                item.definition.grantedModifiers.forEach((grantedMod: any) => {
                    if (grantedMod.type == 'bonus' && grantedMod.subType == 'magic') {
                        magic += grantedMod.value;
                    }
                });

                // Finesse Weapon
                let isFinesse = item.definition.properties.filter((property: any) => { return property.name == 'Finesse'; }).length > 0;
                if (isFinesse && getTotalAbilityScore(character, 2) > getTotalAbilityScore(character, item.definition.attackType)) {
                    item.definition.attackType = 2;
                }

                // Hexblade's Weapon
                let characterValues = getObjects(character.characterValues, 'valueId', item.id);
                characterValues.forEach((cv) => {
                    if (cv.typeId == 29 && getTotalAbilityScore(character, 6) >= getTotalAbilityScore(character, item.definition.attackType)) {
                        item.definition.attackType = 6;
                    }
                });

                let gwf = false;
                let atkmod = 0;
                let dmgmod = 0;
                let hasTWFS = false;

                // process each fighting style only once
                fightingStylesSelected.forEach((fightingStyle) => {
                    if (fightingStyle == 'Great Weapon Fighting' && twohanded && (!ranged)) {
                        gwf = true;
                    }
                    if (fightingStyle == 'Archery' && ranged) {
                        atkmod += 2;
                    }
                    if (fightingStyle == 'Dueling' && !(hasOffhand || ranged || twohanded)) {
                        log('applying Dueling +2 to ' + item.definition.name)
                        dmgmod += 2;
                        log('damage mod now ' + dmgmod)
                    }
                    if (fightingStyle == 'Two-Weapon Fighting') {
                        hasTWFS = true;
                    }
                });

                if (versatile && !(hasOffhand || shieldEquipped)) {
                    item.definition.damage.diceString = versatileDice;
                }

                if (item.definition.isMonkWeapon && monk_level > 0) {
                    let itemAvgDmg = 0;
                    if (item.definition.damage != null) {
                        let dS = item.definition.damage.diceString;
                        let itemDieCount = parseInt(dS.substr(0, dS.indexOf('d')));
                        let itemDieSize = parseInt(dS.substr(dS.indexOf('d') + 1));
                        itemAvgDmg = (itemDieCount * (itemDieSize + 1)) / 2;
                    }

                    let monkDieSize = Math.floor((monk_level - 1) / 4) * 2 + 4;
                    let monkAvgDmg = (1 + monkDieSize) / 2;

                    if (monkAvgDmg > itemAvgDmg) {
                        item.definition.damage.diceString = '1d' + monkDieSize;
                    }

                    let str = getTotalAbilityScore(character, 1);
                    let dex = getTotalAbilityScore(character, 2);
                    if (dex > str) {
                        item.definition.attackType = 2;
                    }
                }

                let dmgattr = _ABILITY.get(<string>_ABILITIES.get(item.definition.attackType));
                if (!hasTWFS && isOffhand) dmgattr = '0';

                // CREATE ATTACK
                let attack = {
                    name: item.definition.name,
                    range: item.definition.range + (item.definition.range != item.definition.longRange ? '/' + item.definition.longRange : '') + 'ft.',
                    attack: {
                        attribute: _ABILITY.get(<string>_ABILITIES.get(item.definition.attackType)),
                        mod: atkmod
                    },
                    damage: {
                        diceString: item.definition.damage != null ? item.definition.damage.diceString + (gwf ? 'ro<2' : '') : '',
                        type: item.definition.damageType,
                        attribute: dmgattr,
                        mod: dmgmod
                    },
                    damage2: {},
                    description: replaceChars(item.definition.description),
                    magic: magic,
                    critrange: Math.min(weapon_critical_range, critical_range)
                };

                item.definition.grantedModifiers.forEach((grantedMod: any) => {
                    if (grantedMod.type == 'damage') {
                        if (grantedMod.dice != null) {
                            attack.damage2 = {
                                diceString: grantedMod.dice.diceString,
                                type: grantedMod.friendlySubtypeName,
                                attribute: grantedMod.statId == null ? '0' : _ABILITY.get(<string>_ABILITIES.get(grantedMod.statId))
                            };
                        }
                    }
                });

                let repAttack = createRepeatingAttack(object, attack, { index: paIndex, itemid: row });
                Object.assign(repeating_attributes, repAttack);
                // /CREATE ATTACK
            }
            let itemArmorClass = 0;
            itemArmorClass += (item.definition.armorClass == null ? 0 : item.definition.armorClass);
            item.definition.grantedModifiers.forEach((grantedMod: any) => {
                for (let ability in _ABILITIES) {
                    if (grantedMod.type == 'set' && grantedMod.subType == ability + '-score') {
                        _itemmodifiers += ', ' + ucFirst(ability) + ': ' + grantedMod.value;
                    }
                }
                if (grantedMod.type == 'bonus') {
                    switch (grantedMod.subType) {
                        case 'armor-class':
                        // wielding a shield or wearing other item which only give a bonus to armor class doesn't qualify as wearing armor
                        // including items such as staff of power, ring of protection, etc.
                        // fall through
                        case 'unarmored-armor-class':
                            if (item.definition.hasOwnProperty('armorClass')) {
                                itemArmorClass += grantedMod.value;
                            }
                            else {
                                _itemmodifiers += ', AC +' + grantedMod.value;
                            }
                            break;
                        case 'saving-throws':
                            _itemmodifiers += ', Saving Throws +' + grantedMod.value;
                            break;
                        case 'ability-checks':
                            _itemmodifiers += ', Ability Checks +' + grantedMod.value;
                            break;
                        case 'speed':
                            // Speed attribute in Roll20 OGL sheets is not calculated. They must be manually set
                            break;
                        case 'magic':
                            // these are picked up in the weapons code above
                            break;
                        default:
                            // these may indicate an unimplemented conversion
                            log('ignoring item ' + item.definition.name + ' bonus modifier for ' + grantedMod.subType);
                    }
                }
                if (grantedMod.type == 'set') {
                    switch (grantedMod.subType) {
                        case 'armor-class':
                        // If an item qualifies as armor, it will be given the .armorClass property and a type property of "Light/Medium/Heavy Armor".
                        // Items with modifiers like this don't qualify as armor. I don't know of any items that have this specific modifier.
                        // fall through
                        case 'unarmored-armor-class':
                            _itemmodifiers += ', AC: ' + grantedMod.value;
                            break;
                        case 'innate-speed-walking':
                        // REVISIT boots of striding and springing give a floor to walking speed through this, but no way to do that in an item in Roll20?
                        // fall through and log as ignored
                        default:
                            // these may indicate an unimplemented conversion
                            log('ignoring item ' + item.definition.name + ' set modifier for ' + grantedMod.subType);
                    }
                }
            });
            if (item.definition.hasOwnProperty('armorClass')) {
                let ac = itemArmorClass;
                if (["Light Armor", "Medium Armor", "Heavy Armor"].indexOf(item.definition.type) >= 0) {
                    // This includes features such as defense fighting style, which require the user to wear armor
                    let aac = getObjects(character, 'subType', 'armored-armor-class');
                    aac.forEach((aacb) => {
                        // ac = parseInt(ac) + parseInt(aacb.value);
                        ac = ac + parseInt(aacb.value);
                    });
                    hasArmor = true;
                }
                _itemmodifiers += ', AC: ' + ac;
            }
            attributes["repeating_inventory_" + row + "_itemmodifiers"] = _itemmodifiers;
            Object.assign(repeating_attributes, attributes);
        });
    }

    // if applicable, create pseudo-armor item for unarmored defense
    createUnarmoredDefense(repeating_attributes, character, total_level);

    if (character.spells.race.length > 0) {
        let spells = character.spells.race;
        spells.forEach((spell: any) => {
            spell.spellCastingAbility = _ABILITIES.get(spell.spellCastingAbilityId);
            class_spells.push(spell);
        });
    }

    // calculate final skill bonuses and proficiencies (including initiative), then write results
    const
        PROFICIENCY_NONE = 0,
        PROFICIENCY_HALF = 1,
        PROFICIENCY_HALF_ROUND_UP = 2,
        PROFICIENCY_FULL = 3,
        PROFICIENCY_EXPERTISE = 4;
    let modifiers: any = {};

    for (let half_proficiency of getObjects(character.modifiers, 'type', 'half-proficiency')) {
        if ((jack_feature !== undefined) &&
            (half_proficiency.componentId === jack_feature.id) &&
            // XXX technically, we should get the follwing constant from classes/classFeatures[]/definition
            (half_proficiency.componentTypeId === 12168134)) {
            // filter out all jack of all trade mods
            continue;
        }
        updateProficiency(modifiers, half_proficiency, PROFICIENCY_HALF);
    }
    for (let half_proficiency_round_up of getObjects(character.modifiers, 'type', 'half-proficiency-round-up')) {
        updateProficiency(modifiers, half_proficiency_round_up, PROFICIENCY_HALF_ROUND_UP);
    }
    for (let proficiency of getObjects(character.modifiers, 'type', 'proficiency')) {
        updateProficiency(modifiers, proficiency, PROFICIENCY_FULL);
    }
    for (let expertise of getObjects(character, 'type', 'expertise')) {
        updateProficiency(modifiers, expertise, PROFICIENCY_EXPERTISE);
    }

    // Adhoc Expertise (REVISIT: check into whether this can be handled more elegantly)
    for (let cv of getObjects(character.characterValues, 'typeId', 26)) {
        if (cv.value == 4) {
            for (let obj of getObjects(character, 'type', 'proficiency')) {
                if (cv.valueId == obj.entityId && cv.valueTypeId == obj.entityTypeId) {
                    updateProficiency(modifiers, obj, PROFICIENCY_FULL);
                }
            }
        }
    }

    // import bonuses that are not from items
    // XXX write separate code to implement those item modifiers that we cannot import in the inventory code, e.g. passive-perception
    // XXX and read those only if both bonuses and inventory are enabled
    for (let bonus of getObjects(character.modifiers, 'type', 'bonus', ['item'])) {
        if (bonus.id.includes('spell')) {
            continue;
        }
        let attribute_basename = bonus.subType.replace(/-/g, '_');
        if (modifiers[attribute_basename] === undefined) {
            log(`beyond: modifier '${attribute_basename}' bonus ${bonus.value}`);
            modifiers[attribute_basename] = { bonus: bonus.value, proficiency: PROFICIENCY_NONE, friendly: bonus.friendlySubtypeName };
        } else {
            log(`beyond: modifier '${attribute_basename}' bonus increased by ${bonus.value}`);
            modifiers[attribute_basename].bonus += bonus.value;
        }
    }


    // emit the final calculated bonuses and proficiencies
    emitAttributesForModifiers(single_attributes, repeating_attributes, modifiers, total_level);

    let contacts = '',
        treasure = '',
        otherNotes = '';

    contacts += (character.notes.allies) ? 'ALLIES:\n' + character.notes.allies + '\n\n' : '';
    contacts += (character.notes.organizations) ? 'ORGANIZATIONS:\n' + character.notes.organizations + '\n\n' : '';
    contacts += (character.notes.enemies) ? 'ENEMIES:\n' + character.notes.enemies : '';

    treasure += (character.notes.personalPossessions) ? 'PERSONAL POSSESSIONS:\n' + character.notes.personalPossessions + '\n\n' : '';
    treasure += (character.notes.otherHoldings) ? 'OTHER HOLDINGS:\n' + character.notes.otherHoldings : '';

    otherNotes += (character.notes.otherNotes) ? 'OTHER NOTES:\n' + character.notes.otherNotes + '\n\n' : '';
    otherNotes += (character.faith) ? 'FAITH: ' + character.faith + '\n' : '';
    otherNotes += (character.lifestyle) ? 'Lifestyle: ' + character.lifestyle.name + ' with a ' + character.lifestyle.cost + ' cost.' : '';


    // TODO there is still something incorrect here

    let background = '';
    if (character.background.definition != null) {
        background = character.background.definition.name;
    }
    if (background == '' && character.background.customBackground.name != null) {
        background = character.background.customBackground.name;
    }

    let initiative_bonus = 0;

    // add dexterity bonus
    let dexterityBase = (character.stats[1].value == null ? 10 : character.stats[1].value);
    initiative_bonus += Math.floor((dexterityBase - 10) / 2);

    // add class modifiers
    initiative_bonus += getObjects(character.modifiers, 'subType', 'initiative').length;

    // other modifiers
    initiative_bonus += ('initiative' in modifiers) ? modifiers.initiative.bonus : 0;

    let other_attributes = {
        // Base Info
        'level': character.classes[0].level + multiclass_level,
        'experience': character.currentXp,
        'race': (character.race.baseName || character.race.fullName),
        'subrace': character.race.subRaceShortName,
        'background': background,
        'speed': speed,
        'hp_temp': character.temporaryHitPoints || '',
        'inspiration': (character.inspiration) ? 'on' : 0,
        'alignment': character.alignmentId == null ? '' : alignments[character.alignmentId],

        // Bio Info
        'age': (character.age || ''),
        'size': (character.size || ''),
        'height': (character.height || ''),
        'weight': (character.weight || ''),
        'eyes': (character.eyes || ''),
        'hair': (character.hair || ''),
        'skin': (character.skin || ''),
        'character_appearance': (character.traits.appearance || ''),

        // Ability Scores
        'strength_base': getTotalAbilityScore(character, 1),
        'dexterity_base': getTotalAbilityScore(character, 2),
        'constitution_base': getTotalAbilityScore(character, 3),
        'intelligence_base': getTotalAbilityScore(character, 4),
        'wisdom_base': getTotalAbilityScore(character, 5),
        'charisma_base': getTotalAbilityScore(character, 6),

        // Traits
        'personality_traits': character.traits.personalityTraits,
        'options-flag-personality': '0',
        'ideals': character.traits.ideals,
        'options-flag-ideals': '0',
        'bonds': character.traits.bonds,
        'options-flag-bonds': '0',
        'flaws': character.traits.flaws,
        'options-flag-flaws': '0',

        // currencies
        'cp': character.currencies.cp,
        'sp': character.currencies.sp,
        'gp': character.currencies.gp,
        'ep': character.currencies.ep,
        'pp': character.currencies.pp,

        // Notes/Bio
        'character_backstory': character.notes.backstory,
        'allies_and_organizations': contacts,
        'additional_feature_and_traits': otherNotes,
        'treasure': treasure,

        'global_save_mod_flag': 1,
        'global_skill_mod_flag': 1,
        'global_attack_mod_flag': 1,
        'global_damage_mod_flag': 1,
        'dtype': 'full',
        'init_tiebreaker': '@{dexterity}/100',
        'initiative_style': calculateInitiativeStyle(character),
        'initmod': initiative_bonus,
        'jack_of_all_trades': (jack_feature !== undefined) ? '@{jack}' : '0'
    };

    Object.assign(single_attributes, other_attributes);

    // these do not need to be written carefully, because they aren't looked at until the sheet is opened

    Object.assign(single_attributes, {
        // prevent upgrades, because they recalculate the class (saves etc.)
        'version': '2.5',

        // prevent character mancer from doing anything
        'l1mancer_status': 'complete',
        'mancer_cancel': 'on'
    });

    // check for bad attribute values and change them to empty strings, because these will cause a crash otherwise
    // ('Error: Firebase.update failed: First argument contains undefined in property 'current'')
    let illegal: any[] = [];
    for (let scan in single_attributes) {
        if ((single_attributes[scan] === undefined) || (single_attributes[scan] === null)) {
            single_attributes[scan] = '';
            illegal.push(scan);
        }
    }
    for (let scan in repeating_attributes) {
        if ((repeating_attributes[scan] === undefined) || (repeating_attributes[scan] === null)) {
            repeating_attributes[scan] = '';
            illegal.push(scan);
        }
    }
    if (illegal.length > 0) {
        log(`beyond: errors during import: the following imported attributes had undefined or null values: ${illegal}`);
    }

    // make work queue
    let items = createSingleWriteQueue(single_attributes);
    processItem(character, items, single_attributes, repeating_attributes, total_level);


    const resultCharacter = new Character();

    resultCharacter.id = single_attributes["id"];
    resultCharacter.name = single_attributes["name"];
    resultCharacter.strength = single_attributes["strength_base"];
    resultCharacter.dexterity = single_attributes["dexterity_base"];
    resultCharacter.constitution = single_attributes["constitution_base"];
    resultCharacter.intelligence = single_attributes["intelligence_base"];
    resultCharacter.wisdom = single_attributes["wisdom_base"];
    resultCharacter.charisma = single_attributes["charisma_base"];
    resultCharacter.initiativeModifier = single_attributes.initmod;
    resultCharacter.rawData = { single_attributes, repeating_attributes };

    return resultCharacter;
}

const calculateInitiativeStyle = (character: any) => {
    let init_mods = getObjects(character.modifiers, 'subType', 'initiative');
    let initadv = init_mods.some(im => im.type == 'advantage');
    let initdis = init_mods.some(im => im.type == 'disadvantage');
    if (initadv && !initdis) {
        return '{@{d20},@{d20}}kh1';
    }
    if (!initadv && initdis) {
        return '{@{d20},@{d20}}kl1';
    }
    return '@{d20}';
}

const updateProficiency = (modifiers: any[], input: any, proficiency_level: number) => {
    let attribute_bases: string[] = [];
    switch (input.subType) {
        case 'ability-checks':
            attribute_bases = all_skills;
            break;
        case 'strength-ability-checks':
            attribute_bases = strength_skills;
            break;
        case 'dexterity-ability-checks':
            attribute_bases = dexterity_skills;
            break;
        case 'intelligence-ability-checks':
            attribute_bases = intelligence_skills;
            break;
        case 'wisdom-ability-checks':
            attribute_bases = wisdom_skills;
            break;
        case 'charisma-ability-checks':
            attribute_bases = charisma_skills;
            break;
        case 'saving-throws':
            attribute_bases = saving_throws;
            break;
        case 'strength-saving-throws':
        case 'dexterity-saving-throws':
        case 'constitution-saving-throws':
        case 'intelligence-saving-throws':
        case 'wisdom-saving-throws':
        case 'charisma-saving-throws':
            attribute_bases = [input.subType.replace('-saving-throws', '_save')];
            break;
        default:
            attribute_bases = [input.subType.replace(/-/g, '_')];
            break;
    }
    for (let attribute_base of attribute_bases) {
        if (modifiers[attribute_base] === undefined) {
            log(`beyond: modifier '${attribute_base}' profiency set to ${proficiency_level}`);
            modifiers[attribute_base] = { bonus: 0, proficiency: proficiency_level, friendly: input.friendlySubtypeName };
            continue;
        } else {
            if (proficiency_level > modifiers[attribute_base].proficiency) {
                // store the maximum proficiency level
                log(`beyond: modifier '${attribute_base}' profiency increased to ${proficiency_level}`);
                modifiers[attribute_base].proficiency = proficiency_level;
            }
        }
    }
}

const createUnarmoredDefense = (repeating_attributes: any, character: any, total_level: number, hasArmor = null) => {
    // If character has unarmored defense, add it to the inventory, so a player can enable/disable it.
    let unarmored = getObjects(character.modifiers, 'subType', 'unarmored-armor-class', ['item']);
    if (unarmored.length < 1) {
        return;
    }
    let x = 0;
    for (let ua of unarmored) {
        if (ua.type != 'set') {
            // ignore unarmored armor class bonus
            return;
        }
        if (ua.value == null) {
            ua.value = Math.floor((getTotalAbilityScore(character, ua.statId) - 10) / 2);
        }

        let row = getRepeatingRowIds('inventory', 'itemname', 'Unarmored Defense')[x];
        let name = 'Unarmored Defense';
        let modifiers = '';

        // Label the unarmored armor class based on the feature it originates from
        character.classes.forEach((charClass: any) => {
            charClass.definition.classFeatures.filter((cF: any) => cF.id == ua.componentId).forEach((cF: any) => {
                name = cF.name;
            });
            if (charClass.subclassDefinition != null) {
                charClass.subclassDefinition.classFeatures.filter((cF: any) => cF.id == ua.componentId).forEach((cF: any) => {
                    name = cF.name;
                });
            }
        });
        character.race.racialTraits.filter((rT: any) => rT.id == ua.componentId).forEach((rT: any) => {
            name = rT.name;
        })

        let integrated = false;
        if (ua.componentTypeId == 306912077) { // Integrated Protection (Armor Type Option)
            row = getRepeatingRowId('inventory', 'itemname', 'Integrated Protection', 0);
            name = 'Integrated Protection';
            integrated = true;
            if (ua.value == 6) {
                modifiers = 'Item Type: Heavy Armor';
                ua.value = 10 + parseInt(ua.value);
            }
            else if (ua.value == 3) {
                modifiers == 'Item Type: Medium Armor'
                ua.value = 10 + parseInt(ua.value);
            }
            ua.value += Math.floor((total_level - 1) / 4) + 2;
        }

        modifiers += (modifiers == '' ? '' : ', ') + 'AC: ' + ua.value

        let attributes: any = {}
        attributes["repeating_inventory_" + row + "_itemname"] = name;
        attributes["repeating_inventory_" + row + "_equipped"] = (integrated || !hasArmor) ? '1' : '0';
        attributes["repeating_inventory_" + row + "_itemcount"] = 1;
        attributes["repeating_inventory_" + row + "_itemmodifiers"] = modifiers;
        Object.assign(repeating_attributes, attributes);
        x++;
    }
}

const createSingleWriteQueue = (attributes: any) => {
    // this is the list of trigger attributes that will trigger class recalculation, as of 5e OGL 2.5 October 2018
    // (see on... handler that calls update_class in sheet html)
    // these are written first and individually, since they trigger a lot of changes
    let class_update_triggers = [
        'class', // NOTE: MUST be first because of shift below
        'custom_class',
        'cust_classname',
        'cust_hitdietype',
        'cust_spellcasting_ability',
        'cust_spellslots',
        'cust_strength_save_prof',
        'cust_dexterity_save_prof',
        'cust_constitution_save_prof',
        'cust_intelligence_save_prof',
        'cust_wisdom_save_prof',
        'cust_charisma_save_prof',
        'subclass',
        'multiclass1',
        'multiclass1_subclass',
        'multiclass2',
        'multiclass2_subclass',
        'multiclass3',
        'multiclass3_subclass'];

    // set class first, everything else is alphabetical
    let classAttribute = class_update_triggers.shift();
    class_update_triggers.sort();
    if (classAttribute) {
        class_update_triggers.unshift(classAttribute);
    }

    // write in deterministic order (class first, then alphabetical)
    let items: any[] = [];
    for (let trigger of class_update_triggers) {
        let value = attributes[trigger];
        if ((value === undefined) || (value === null)) {
            continue;
        }
        items.push([trigger, value]);
        log('beyond: trigger attribute ' + trigger);
        delete attributes[trigger];
    }
    return items;
}

const processItem = (character: any, items: any[], single_attributes: any, repeating_attributes: any, total_level: number) => {
    let nextItem = items.shift();

    // check if the write queue was empty
    if (nextItem === undefined) {
        // do one giant write for all the single attributes, before we create a bunch of attacks 
        // and other things that depend on stat changes
        //setAttrs(object.id, single_attributes);

        // do one giant write for all the repeating attributes
        //setAttrs(object.id, repeating_attributes);

        // configure HP, because we now know our CON score
        loadHitPoints(character, total_level);

        importSpells(character, class_spells);

        /*if (class_spells.length > 0 && state[state_name][beyond_caller.id].config.imports.class_spells) {
            sendChat(script_name, '<div style="' + style + '">Import of <b>' + character.name + '</b> is almost ready.<br />Class spells are being imported over time.</div>', null, { noarchive: true });

            // this is really just artificially asynchronous, we are not currently using a worker, so it will happen as soon as we return
            onSheetWorkerCompleted(() => {
                importSpells(character, class_spells);
            })
        } else {
            reportReady(character);
        }
        return
        */
    }

    // create empty attribute if not already there
    //let nextAttribute = findObjs({ type: 'attribute', characterid: object.id, name: nextItem[0] })[0];
    //nextAttribute = nextAttribute || createObj('attribute', { name: nextItem[0], characterid: object.id });

    // async load next item
    //onSheetWorkerCompleted(function () {
    // processItem(character, items, single_attributes, repeating_attributes, total_level);
    //});
    log('beyond: ' + nextItem[0] + " = " + String(nextItem[1]));
    //nextAttribute.setWithWorker({ current: nextItem[1] });
}

const loadHitPoints = (character: any, total_level: number) => {
    let hp = Math.floor(character.baseHitPoints + (total_level * Math.floor(((getTotalAbilityScore(character, 3) - 10) / 2))));

    // scan for modifiers except those in items, because we will get those bonuses from the items once they are imported
    // NOTE: this also handles the problem that Beyond includes modifiers from items that are not currently equipped/attuned
    let hpLevelBonus = getObjects(character.modifiers, 'subType', 'hit-points-per-level', ['item']).forEach((bonus) => {
        let level = total_level;

        // Ensure that per-level bonuses from class features only apply for the levels of the class and not the character's total level.
        let charClasses = character.classes.filter((charClass: any) => {
            let output = charClass.definition.classFeatures.findIndex((cF: any) => cF.id == bonus.componentId) >= 0;
            if (charClass.subclassDefinition != null) {
                output = output || charClass.subclassDefinition.classFeatures.findIndex((cF: any) => cF.id == bonus.componentId) >= 0;
            }
            return output;
        });

        if (charClasses.length > 0) {
            level = 0;
            charClasses.forEach((charClass: any) => {
                level += parseInt(charClass.level);
            });
        }

        hp += level * bonus.value;
    });

    // TODO find somewhere else to put this

    /*
    let hpAttr = findObjs({ type: 'attribute', characterid: object.id, name: 'hp' })[0];
    if (hpAttr == null) {
        createObj('attribute', {
            characterid: object.id,
            name: 'hp',
            current: hp,
            max: hp
        });
    } else {
        hpAttr.set('current', hp);
        hpAttr.set('max', hp);
    }
    */
}

const getPactMagicSlots = (level: number) => {
    switch (level) {
        case 1:
            return 1;

        case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10:
            return 2;

        case 11: case 12: case 13: case 14: case 15: case 16:
            return 3;

        default:
            return 4;
    }
};

const getFeatureSpells = (character: any, traitId: any, featureType: string) => {
    let spellsArr: any[] = [];
    if (character.spells[featureType] == null) return spellsArr;
    if (character.spells[featureType].length > 0) {
        let options = getObjects(character.options[featureType], 'componentId', traitId);
        for (let i = 0; i < options.length; i++) {
            let spells = getObjects(character.spells[featureType], 'componentId', options[i].definition.id);
            for (let j = 0; j < spells.length; j++) {
                spellsArr.push(spells[j])
            }
        }
    }
    return spellsArr;
};

const importSpells = (character: any, spells: any[]) => {
    // set this to whatever number of items you can process at once
    // return attributes;
    spellAttacks = [];
    let chunk = 5;
    let index = 0;

    /*
    function doChunk() {
        let cnt = chunk;
        let attributes = {};
        while (cnt-- && index < spells.length) {
            Object.assign(attributes, importSpell(character, spells, index, true));
            ++index;
        }
        setAttrs(object.id, attributes);
        if (index < spells.length) {
            // set Timeout for async iteration
            onSheetWorkerCompleted(doChunk);
        } else {
            log('beyond: spells imported, updating spell attack proficiency');
            onSheetWorkerCompleted(() => {
                updateSpellAttackProf(character, 0);
            });
        }
    }
    doChunk();
    */
};

const updateSpellAttackProf = (character: any, i: number) => {
    if (spellAttacks[i] == null) {
        //reportReady(character);
        return;
    }

    // This should work... but it doesn't.
    /*let atkOutputAttr = findObjs({ type: 'attribute', characterid: object.id, name: "repeating_spell-"+spellAttacks[i].level+"_"+spellAttacks[i].id+"_spelloutput" })[0];
     atkOutputAttr = atkOutputAttr || createObj('attribute', { name: "repeating_spell-"+spellAttacks[i].level+"_"+spellAttacks[i].id+"_spelloutput", characterid: object.id});
     onSheetWorkerCompleted(function() {
     updateSpellAttackProf(character, ++i);
     });
     log('beyond: ' + "repeating_spell-"+spellAttacks[i].level+"_"+spellAttacks[i].id+"_spelloutput" + " = " + 'ATTACK');
     atkOutputAttr.setWithWorker({ current: 'ATTACK' });*/

    /*
   let atkIdAttr = findObjs({ type: 'attribute', characterid: object.id, name: 'repeating_spell-' + spellAttacks[i].level + '_' + spellAttacks[i].id + '_spellattackid' })[0];
   if (atkIdAttr != null) {
       let atkId = atkIdAttr.get('current');
       let atkProfAttr = findObjs({ type: 'attribute', characterid: object.id, name: 'repeating_attack_' + atkId + '_atkprofflag' })[0];
       atkProfAttr = atkProfAttr || createObj('attribute', { name: 'repeating_attack_' + atkId + '_atkprofflag', characterid: object.id });

       // async load next item
       onSheetWorkerCompleted(function () {
           updateSpellAttackProf(character, ++i);
       });
       log('beyond: ' + 'repeating_attack_' + atkId + '_atkprofflag' + " = " + '(@{pb})');
       atkProfAttr.setWithWorker({ current: '(@{pb})' });
   }
   else {
       reportReady(character);
   }
   */
}

const importSpell = (character: any, spells: any[], index: number, addAttack: any) => {
    let spell = spells[index];

    let matchingSpells = spells.filter((spellAttributes) => {
        return spellAttributes.definition.name == spell.definition.name;
    });

    let level = (spell.definition.level === 0) ? 'cantrip' : spell.definition.level.toString();
    let row = getRepeatingRowId('spell-' + level, 'spellname', spell.definition.name, matchingSpells.findIndex(sA => sA.id == spell.id && sA.spellCastingAbility == spell.spellCastingAbility));

    spell.castingTime = {
        castingTimeInterval: spell.activation.activationTime,
    };
    if (spell.activation.activationType == 1) spell.castingTime.castingTimeUnit = 'Action';
    if (spell.activation.activationType == 3) spell.castingTime.castingTimeUnit = 'Bonus Action';
    if (spell.activation.activationType == 4) spell.castingTime.castingTimeUnit = 'Reaction';
    if (spell.activation.activationType == 5) spell.castingTime.castingTimeUnit = 'Second' + (spell.activation.activationTime != 1 ? 's' : '');
    if (spell.activation.activationType == 6) spell.castingTime.castingTimeUnit = 'Minute' + (spell.activation.activationTime != 1 ? 's' : '');
    if (spell.activation.activationType == 7) spell.castingTime.castingTimeUnit = 'Hour' + (spell.activation.activationTime != 1 ? 's' : '');
    if (spell.activation.activationType == 8) spell.castingTime.castingTimeUnit = 'Day' + (spell.activation.activationTime != 1 ? 's' : '');

    let attributes: any = {};
    attributes["repeating_spell-" + level + "_" + row + "_spellprepared"] = (spell.prepared || spell.alwaysPrepared) ? '1' : '0';
    attributes["repeating_spell-" + level + "_" + row + "_spellname"] = spell.definition.name;
    attributes["repeating_spell-" + level + "_" + row + "_spelllevel"] = level;
    attributes["repeating_spell-" + level + "_" + row + "_spellschool"] = spell.definition.school.toLowerCase();
    attributes["repeating_spell-" + level + "_" + row + "_spellritual"] = (spell.ritual) ? '{{ritual=1}}' : '0';
    attributes["repeating_spell-" + level + "_" + row + "_spellcastingtime"] = spell.castingTime.castingTimeInterval + ' ' + spell.castingTime.castingTimeUnit;
    attributes["repeating_spell-" + level + "_" + row + "_spellrange"] = (spell.definition.range.origin === 'Ranged') ? spell.definition.range.rangeValue + 'ft.' : spell.definition.range.origin;
    attributes["repeating_spell-" + level + "_" + row + "_options-flag"] = '0';
    attributes["repeating_spell-" + level + "_" + row + "_spellritual"] = (spell.definition.ritual) ? '1' : '0';
    attributes["repeating_spell-" + level + "_" + row + "_spellconcentration"] = (spell.definition.concentration) ? '{{concentration=1}}' : '0';
    attributes["repeating_spell-" + level + "_" + row + "_spellduration"] = (spell.definition.duration.durationUnit !== null) ? spell.definition.duration.durationInterval + ' ' + spell.definition.duration.durationUnit : spell.definition.duration.durationType;
    attributes["repeating_spell-" + level + "_" + row + "_spell_ability"] = spell.spellCastingAbility == null ? '0*' : '@{' + _ABILITY.get(spell.spellCastingAbility) + '_mod}+';

    let descriptions = spell.definition.description.split('At Higher Levels. ');
    attributes["repeating_spell-" + level + "_" + row + "_spelldescription"] = replaceChars(descriptions[0]);
    attributes["repeating_spell-" + level + "_" + row + "_spellathigherlevels"] = (descriptions.length > 1) ? replaceChars(descriptions[1]) : '';

    let components = spell.definition.components;
    attributes["repeating_spell-" + level + "_" + row + "_spellcomp_v"] = (components.includes(1)) ? '{{v=1}}' : '0';
    attributes["repeating_spell-" + level + "_" + row + "_spellcomp_s"] = (components.includes(2)) ? '{{s=1}}' : '0';
    attributes["repeating_spell-" + level + "_" + row + "_spellcomp_m"] = (components.includes(3)) ? '{{m=1}}' : '0';
    attributes["repeating_spell-" + level + "_" + row + "_spellcomp_materials"] = (components.includes(3)) ? replaceChars(spell.definition.componentsDescription) : '';

    let healingObjs = getObjects(spell, 'subType', 'hit-points');
    let healing: any = null;
    if (healingObjs.length !== 0) {
        healing = healingObjs[0];
        if (healing.type == 'bonus') {
            let bonus = 0;
            if (getObjects(character.classes, 'name', 'Disciple of Life').length > 0) {
                bonus += (2 + parseInt(spell.definition.level));
            }

            attributes["repeating_spell-" + level + "_" + row + "_spellattack"] = 'None';
            attributes["repeating_spell-" + level + "_" + row + "_spellsave"] = '';
            attributes["repeating_spell-" + level + "_" + row + "_spelldamage"] = '';
            attributes["repeating_spell-" + level + "_" + row + "_spelldamagetype"] = '';
            if (healing.die.diceString != null) {
                attributes["repeating_spell-" + level + "_" + row + "_spellhealing"] = healing.die.diceString + '+' + (parseInt(healing.die.fixedValue == null ? 0 : healing.die.fixedValue) + bonus);
            }
            else if (healing.die.fixedValue != null) {
                attributes["repeating_spell-" + level + "_" + row + "_spellhealing"] = (parseInt(healing.die.fixedValue) + bonus) + 'd1';
            }
            attributes["repeating_spell-" + level + "_" + row + "_spelldmgmod"] = healing.usePrimaryStat ? 'Yes' : '0';

            bonus = 0;
            if (getObjects(character.classes, 'name', 'Disciple of Life').length > 0) {
                bonus += 1;
            }

            let ahl = spell.definition.atHigherLevels.higherLevelDefinitions;
            for (let i in ahl) {
                if (ahl[i].dice != null) {
                    if (ahl[i].dice.diceValue != null) {
                        attributes["repeating_spell-" + level + "_" + row + "_spellhldie"] = ahl[i].dice.diceCount;
                        attributes["repeating_spell-" + level + "_" + row + "_spellhldietype"] = 'd' + ahl[i].dice.diceValue;
                    }
                    else {
                        attributes["repeating_spell-" + level + "_" + row + "_spellhldie"] = '0';
                        attributes["repeating_spell-" + level + "_" + row + "_spellhldietype"] = 'd4';
                    }
                    attributes["repeating_spell-" + level + "_" + row + "_spellhlbonus"] = parseInt(ahl[i].dice.fixedValue) + bonus;
                }
            }

            if (healing.hasOwnProperty('atHigherLevels') && healing.atHigherLevels.scaleType === 'spellscale') {
                if (healing.die.diceValue != null) {
                    attributes["repeating_spell-" + level + "_" + row + "_spellhldie"] = healing.die.diceCount;
                    attributes["repeating_spell-" + level + "_" + row + "_spellhldietype"] = 'd' + healing.die.diceValue;
                }
                else {
                    attributes["repeating_spell-" + level + "_" + row + "_spellhldie"] = '0';
                    attributes["repeating_spell-" + level + "_" + row + "_spellhldietype"] = 'd4';
                }
                if (healing.die.fixedValue == null) healing.die.fixedValue = 0;
                attributes["repeating_spell-" + level + "_" + row + "_spellhlbonus"] = parseInt(healing.die.fixedValue) + bonus;
            }

            if (addAttack) {
                attributes["repeating_spell-" + level + "_" + row + "_spelloutput"] = 'ATTACK';
            }
        }
    }

    // Damage/Attack
    let damages = getObjects(spell, 'type', 'damage');
    if (damages.length !== 0 && (spell.definition.attackType !== "" || spell.definition.saveDcStat !== null)) {
        let doDamage = false;
        damages.forEach((damage, i) => {
            if (damage.die.diceString != null) {
                let damageNumber = (i === 0) ? '' : 2;
                attributes["repeating_spell-" + level + "_" + row + "_spelldamage" + damageNumber] = damage.die.diceString;
                attributes["repeating_spell-" + level + "_" + row + "_spelldamagetype" + damageNumber] = damage.friendlySubtypeName;

                if (!doDamage) {
                    doDamage = true;

                    let attackType = ['None', 'Melee', 'Ranged'];
                    attributes["repeating_spell-" + level + "_" + row + "_spellattack"] = attackType[spell.definition.attackType == null ? 0 : spell.definition.attackType];
                    attributes["repeating_spell-" + level + "_" + row + "_spellsave"] = (spell.definition.saveDcAbilityId == null) ? '' : ucFirst(<string>_ABILITY.get(<string>_ABILITIES.get(spell.definition.saveDcAbilityId)));

                    let hlDiceCount = '';
                    let hlDiceValue = '';

                    if (damage.hasOwnProperty('atHigherLevels')) {
                        let ahl = spell.definition.atHigherLevels.higherLevelDefinitions;
                        if (spell.definition.level == 0 && ahl.length == 0) {
                            if (spell.definition.atHigherLevels.scaleType == 'characterlevel') {
                                attributes["repeating_spell-" + level + "_" + row + "_spell_damage_progression"] = 'Cantrip Dice';
                            }
                        }
                        else if (spell.definition.level > 0) {
                            for (let i in ahl) {
                                if (ahl[i].dice == null) continue;
                                attributes["repeating_spell-" + level + "_" + row + "_spellhldie"] = ahl[i].dice.diceCount;
                                attributes["repeating_spell-" + level + "_" + row + "_spellhldietype"] = 'd' + ahl[i].dice.diceValue;
                                hlDiceCount = ahl[i].dice.diceCount;
                                hlDiceValue = ahl[i].dice.diceValue;
                            }

                            if (damage.atHigherLevels.scaleType === 'spellscale') {
                                attributes["repeating_spell-" + level + "_" + row + "_spellhldie"] = '1';
                                attributes["repeating_spell-" + level + "_" + row + "_spellhldietype"] = 'd' + damage.die.diceValue;
                                hlDiceCount = '1';
                                hlDiceValue = damage.die.diceValue;
                            }
                        }
                    }
                }
            }
        });

        if (addAttack && doDamage) {
            // attributes["repeating_spell-"+level+"_"+row+"_spelloutput"] = 'SPELLCARD';
            attributes["repeating_spell-" + level + "_" + row + "_spelloutput"] = 'ATTACK';
            spellAttacks.push({ level: level, id: row });
        }
    }

    if (spellTargetInAttacks && healing) {
        let restrictions = calculateRestrictionsComment(damages.concat(healing));
        if (restrictions != null) {
            attributes["repeating_spell-" + level + "_" + row + "_spelltarget"] = replaceChars(restrictions);
            if (attributes["repeating_spell-" + level + "_" + row + "_spelloutput"] == 'ATTACK') {
                attributes["repeating_spell-" + level + "_" + row + "_includedesc"] = 'partial';
            }
        }
    }
    return attributes;
};

// calculates spell restriction comment from damage and hit-points modifiers, as follows:
//
// as type selection (different restrictions):
// (friendlySubtypeName || friendlyTypeName) : restriction\n
// (friendlySubtypeName || friendlyTypeName) : restriction\n
// ...
//
// as general constraint (single modifier with a restriction):
// restriction 
//
// as multiple choice (same restriction multiple modifiers):
// restriction
//
// NOTE: this function is very defensive about inputs because some entries from beyond have
// null values and others have empty strings
const calculateRestrictionsComment = (modifiers: any[]) => {
    if (!modifiers) {
        return null;
    }
    if (modifiers.length < 1) {
        return null;
    }
    let restrictions = new Set<string>();
    let first = blankIfNull(modifiers[0].restriction);
    let multiple = false;
    modifiers.forEach((modifier: any, i: number) => {
        let current = blankIfNull(modifier.restriction);
        if (current != first) {
            // even if some types have null restrictions and others have non-blank ones, this still counts as choices
            multiple = true;
        }
        if (current != '') {
            // record all unique combinations
            restrictions.add((modifier.friendlySubtypeName || modifier.friendlyTypeName) + ": " + current);
        }
    });
    let lines = [...restrictions];
    if (multiple && (lines.length > 0)) {
        // NOTE: it is possible to have only one line here because the other choices are blank or null
        return lines.join('\n');
    }
    if (first == '') {
        // convert back to null if all we had was a blank (or null) restriction
        return null;
    }
    return first;
}

const ucFirst = (string: string) => {
    if (string == null) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const getTotalAbilityScore = (character: any, scoreId: number) => {
    let index = scoreId - 1;
    let base = (character.stats[index].value == null ? 10 : character.stats[index].value);
    let bonus = (character.bonusStats[index].value == null ? 0 : character.bonusStats[index].value);
    let override = (character.overrideStats[index].value == null ? 0 : character.overrideStats[index].value);
    let total = base + bonus;
    let modifiers = getObjects(character, '', _ABILITY.get(<string>_ABILITIES.get(scoreId)) + "-score");
    if (override > 0) total = override;
    if (modifiers.length > 0) {
        let used_ids: any[] = [];
        for (let i = 0; i < modifiers.length; i++) {
            if (modifiers[i].type == 'bonus' && used_ids.indexOf(modifiers[i].id) == -1) {
                total += modifiers[i].value;
                used_ids.push(modifiers[i].id);
            }
        }
    }

    return total;
}

function generateUUID(): string {
    let a = 0;
    let b: number[] = [];
    let result = "";
    let c = (new Date()).getTime() + 0;
    let d = c === a;
    a = c;
    for (var e = new Array(8), f = 7; 0 <= f; f--) {
        e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
        c = Math.floor(c / 64);
    }
    result = `${c}${e}`;
    if (d) {
        for (f = 11; 0 <= f && 63 === b[f]; f--) {
            b[f] = 0;
        }
        b[f]++;
    } else {
        for (f = 0; 12 > f; f++) {
            b[f] = Math.floor(64 * Math.random());
        }
    }
    for (f = 0; 12 > f; f++) {
        result += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
    }
    return result;
}

const generateRowID = function () {
    "use strict";
    return generateUUID().replace(/_/g, "Z");
};

const regexIndexOf = (str: string, regex: string, startpos: number) => {
    let indexOf = str.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};

/*
Kept for reference

const setDefaults = (reset) => {
    const defaults = {
        overwrite: false,
        debug: false,
        prefix: '',
        suffix: '',
        inplayerjournals: '',
        controlledby: '',
        languageGrouping: false,
        initTieBreaker: false,
        spellTargetInAttacks: true,
        imports: {
            classes: true,
            class_spells: true,
            class_traits: true,
            inventory: true,
            proficiencies: true,
            traits: true,
            languages: true,
            bonuses: true,
            notes: true,
        }
    };

    let playerObjects = findObjs({
        _type: "player",
    });
    playerObjects.forEach((player) => {
        if (!state[state_name][player.id]) {
            state[state_name][player.id] = {};
        }

        if (!state[state_name][player.id].config) {
            state[state_name][player.id].config = defaults;
        }

        for (let item in defaults) {
            if (!state[state_name][player.id].config.hasOwnProperty(item)) {
                state[state_name][player.id].config[item] = defaults[item];
            }
        }

        for (let item in defaults.imports) {
            if (!state[state_name][player.id].config.imports.hasOwnProperty(item)) {
                state[state_name][player.id].config.imports[item] = defaults.imports[item];
            }
        }

        if (!state[state_name][player.id].config.hasOwnProperty('firsttime')) {
            if (!reset) {
                sendConfigMenu(player, true);
            }
            state[state_name][player.id].config.firsttime = false;
        }
    });
};

*/

const importClassOptions = (repeating_attributes: any, trait: any, current_class: any, class_options: any, repeat_index: number) => {
    if (trait.requiredLevel > current_class.level) {
        // not applied to this character, trait is available at higher levels
        return repeat_index;
    }

    // search for selected options for the given trait
    let selections = getObjects(class_options, 'componentId', trait.id);
    if (selections.length < 1) {
        // no selections, ignore trait
        return repeat_index;
    }

    let index = repeat_index;
    for (let selection of selections) {
        let text = replaceChars(`${selection.definition.description}`);
        let trait_docs = {
            name: selection.definition.name,
            description: text,
            source: 'Class',
            source_type: current_class.definition.name
        }
        Object.assign(repeating_attributes, createRepeatingTrait(object, trait_docs, index++));
    }
    return index;
};

const emitAttributesForModifiers = (single_attributes: any, repeating_attributes: any, modifiers: any, total_level: number) => {
    let basenames = Object.keys(modifiers);
    basenames.sort();
    // for half proficiency types, we have to set a constant that is only valid for the current level, because
    // the 5e OGL sheet does not understand these types of proficiency
    let proficiency_bonus = (Math.floor((total_level - 1) / 4) + 2);
    for (let basename of basenames) {
        let modifier = modifiers[basename];
        let mod = 0;
        if (modifier.bonus !== undefined) {
            mod = modifier.bonus;
        }
        log(`beyond: final modifier ${basename} (${modifier.friendly}) proficiency ${modifier.proficiency} bonus ${modifier.bonus}`)
        if (all_skills.indexOf(basename) !== -1) {
            switch (modifier.proficiency) {
                case 0:
                    // no proficiency
                    break;
                case 1:
                    single_attributes[`${basename}_prof`] = '';
                    single_attributes[`${basename}_flat`] = mod + Math.floor(proficiency_bonus / 2);
                    break;
                case 2:
                    single_attributes[`${basename}_prof`] = '';
                    single_attributes[`${basename}_flat`] = mod + Math.ceil(proficiency_bonus / 2);
                    break;
                case 3:
                    single_attributes[`${basename}_prof`] = `(@{pb}*@{${basename}_type})`;
                    if (mod !== 0) {
                        single_attributes[`${basename}_flat`] = mod;
                    }
                    break;
                case 4:
                    single_attributes[`${basename}_prof`] = `(@{pb}*@{${basename}_type})`;
                    single_attributes[`${basename}_type`] = 2;
                    if (mod !== 0) {
                        single_attributes[`${basename}_flat`] = mod;
                    }
                    break;
            }
        } else if (saving_throws.indexOf(basename) !== -1) {
            switch (modifier.proficiency) {
                case 0:
                    // no proficiency
                    break;
                case 1:
                    single_attributes[`${basename}_prof`] = '';
                    single_attributes[`${basename}_mod`] = mod + Math.floor(proficiency_bonus / 2);
                    break;
                case 2:
                    single_attributes[`${basename}_prof`] = '';
                    single_attributes[`${basename}_mod`] = mod + Math.ceil(proficiency_bonus / 2);
                    break;
                case 3:
                    single_attributes[`${basename}_prof`] = `(@{pb})`;
                    if (mod !== 0) {
                        single_attributes[`${basename}_mod`] = mod;
                    }
                    break;
                case 4:
                    // this case probably does not exist in the 5e rules, but we can at least support
                    // it in the constant for current level style
                    single_attributes[`${basename}_prof`] = '(@{pb})';
                    single_attributes[`${basename}_mod`] = proficiency_bonus + mod;
                    break;
            }
        } else if (modifier.proficiency > 0) {
            // general proficiency 
            let type = 'OTHER';
            if (basename.includes('weapon')) {
                type = 'WEAPON';
            } else if (basename.includes('armor')) {
                type = 'ARMOR';
            } else if (basename.includes('shield')) {
                type = 'ARMOR';
            } else if (weapons.indexOf(modifier.friendly) !== -1) {
                type = 'WEAPON';
            }
            let row = getRepeatingRowIds('proficiencies', 'name', modifier.friendly)[0];
            repeating_attributes["repeating_proficiencies_" + row + "_name"] = modifier.friendly;
            repeating_attributes["repeating_proficiencies_" + row + "_prof_type"] = type;
            repeating_attributes["repeating_proficiencies_" + row + "_options-flag"] = '0'; // XXX why is this set as string?
        }
        // XXX implement passive-perception bonus ('passiveperceptionmod') etc.
    }
};
