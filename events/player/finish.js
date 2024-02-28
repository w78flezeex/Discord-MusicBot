const { EmbedBuilder } = require('discord.js')
const db = require("../../mongoDB");
module.exports = async (client, queue) => {
let lang = await db?.musicbot?.findOne({ guildID: queue?.textChannel?.guild?.id })
lang = lang?.language || client.language
lang = require(`../../languages/${lang}.js`);
if (queue?.textChannel) {
    const embed = new EmbedBuilder()
    .setDescription(`${lang.msg14}`)
    .setColor(client.config.embedColor);
queue?.textChannel?.send({ embeds: [embed] }).catch(e => { })
}
}
