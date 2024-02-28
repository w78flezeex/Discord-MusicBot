const { EmbedBuilder } = require('discord.js')
const db = require("../../mongoDB");
module.exports = async (client, queue, playlist) => {
let lang = await db?.musicbot?.findOne({ guildID: queue?.textChannel?.guild?.id })
lang = lang?.language || client.language
lang = require(`../../languages/${lang}.js`);
const embed = new EmbedBuilder()
.setColor(client.config.embedColor)
.setDescription(`<@${playlist.user.id}>, \`${playlist.name} (${playlist.songs.length + " " + lang.msg116})\` ${lang.msg62}`);
queue?.textChannel?.send({ embeds: [embed] }).catch(e => { });
}
