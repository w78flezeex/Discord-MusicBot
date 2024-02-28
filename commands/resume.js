const { EmbedBuilder } = require('discord.js')
const db = require("../mongoDB");
module.exports = {
name: "resume",
description: "Возобновить проигрывание песни.",
permissions: "0x0000000000000800",
options: [],
voiceChannel: true,
run: async (client, interaction) => {
const queue = client.player.getQueue(interaction.guild.id);
let lang = await db?.musicbot?.findOne({ guildID: interaction.guild.id })
lang = lang?.language || client.language
lang = require(`../languages/${lang}.js`);
try {

    if (!queue) {
    const embed = new EmbedBuilder()
    .setDescription(lang.msg63)
    .setColor(client.config.errorColor);
    return interaction.reply({embeds: [embed], ephemeral: true }).catch(e => { })};
    if(!queue.paused){
    const embed = new EmbedBuilder()
    .setDescription(lang.msg132)
    .setColor(client.config.errorColor);
    return interaction.reply({embeds: [embed], ephemeral: true }).catch(e => { })};
    const success = queue.resume()
    const embed = new EmbedBuilder()
    .setDescription(success ? `${lang.msg72}` : lang.msg71)
    .setColor(client.config.embedColor);
    return interaction.reply({ embeds: [embed], }).catch(e => { })

} catch (e) {
    const errorNotifer = require("../functions.js")
   errorNotifer(client, interaction, e, lang)
    }
},
};
