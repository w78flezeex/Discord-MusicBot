const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require("../../mongoDB");
module.exports = async (client, queue, track, song) => {
  let lang = await db?.musicbot?.findOne({ guildID: queue?.textChannel?.guild?.id })
  lang = lang?.language || client.language
  lang = require(`../../languages/${lang}.js`);

  let music_percent = queue.duration / 100;
      let music_percent2 = queue.currentTime / music_percent;
      let music_percent3 = Math.round(music_percent2);

  if (queue) {
    if (!client.config.opt.loopMessage && queue?.repeatMode !== 0) return;
    if (queue?.textChannel) {
        const embed = new (EmbedBuilder)
        embed.setTitle('Начала играть новая песня:')
        embed.setDescription(`\`\`\`${track.name}\`\`\``)
        embed.addFields({ name: 'Длительность трека:', value: `>>> \`${track.formattedDuration}\`` })
        embed.addFields({ name: 'Заказал трек:', value: `>>> <@${track.user.id}>` })
        embed.setTimestamp()
        embed.setColor(client.config.embedColor)

        queue?.textChannel?.send({ embeds: [embed]}).catch(e => {});
    }
  }
}