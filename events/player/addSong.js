const {EmbedBuilder } = require('discord.js');
const db = require("../../mongoDB");
module.exports = async (client, queue, track, song) => {
let lang = await db?.musicbot?.findOne({ guildID: queue?.textChannel?.guild?.id })
lang = lang?.language || client.language
lang = require(`../../languages/${lang}.js`);
const embed = new EmbedBuilder()
.setTitle('Новая песня добавлена в очередь:')
.setDescription(`\`\`\`${track.name}\`\`\``)
.setFields({name: 'Длительность трека:', value: `>>> \`${track.formattedDuration}\``})
embed.addFields({name: 'Заказал трек:', value: `>>> <@${track.user.id}>`})
.setColor(client.config.embedColor)
.setTimestamp()
queue?.textChannel?.send({ embeds: [embed] }).catch(e => { })
}
