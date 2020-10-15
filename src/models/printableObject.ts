import { MessageEmbed } from "discord.js";

/**
 * Generic thing to implement when creating a printable object
 */
export interface PrintableObject {
    createEmbed(...params: any): MessageEmbed
}