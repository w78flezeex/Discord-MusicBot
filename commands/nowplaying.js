const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require("../mongoDB");
module.exports = {
  name: "nowplaying",
  description: "Показать дополнительные детали песни.",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction.guild.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);

    try {

      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) {
      const embed = new EmbedBuilder()
      .setColor(client.config.errorColor)
      .setDescription(lang.msg5);
      return interaction.reply({embeds: [embed], ephemeral: true }).catch(e => { })}; 

      const track = queue.songs[0];
      if (!track) {
      const embed = new EmbedBuilder()
      .setDescription(lang.msg5)
      .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { })};

      const embed = new EmbedBuilder();
      embed.setColor(client.config.embedColor);
      embed.setTitle(track.name)
      embed.setDescription(`> Аудио: \`${queue.volume}%\`
> Длительность: \`${track.formattedDuration}\`
> Режим повтора: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Вся очередь' : 'Только эта музыка') : 'Отключено'}\`
> Фильтр: \`${queue.filters.names.join(', ') || 'Отключен'}\`
> Запустил аудио: <@${track.user.id}>`);

      embed.setTimestamp();
      embed.setFooter({ text: `Retura` })

      interaction.reply({ embeds: [embed] }).catch(e => { })

    } catch (e) {
      const errorNotifer = require("../functions.js")
     errorNotifer(client, interaction, e, lang)
      }
  },
};
