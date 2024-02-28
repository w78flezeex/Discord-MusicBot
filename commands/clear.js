const { EmbedBuilder } = require('discord.js')
const db = require("../mongoDB");
module.exports = {
  name: "clear",
  description: "Очистить очередь.",
  permissions: "0x0000000000000800",
  options: [],
  voiceChannel: true,
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild.id);
    let lang = await db?.musicbot?.findOne({ guildID: interaction.guild.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);
    try {

      if (!queue || !queue.playing) {
      const embed = new EmbedBuilder()
      .setDescription(`${lang.msg5}`)
      .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { })};
      if (!queue.songs[0]) {
      const embed = new EmbedBuilder()
      .setDescription(`${lang.msg23}`)
      .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { })};
      await queue.stop(interaction.guild.id);
      const embed = new EmbedBuilder()
      .setDescription(`${lang.msg24}`)
      .setColor(client.config.embedColor);
      interaction.reply({ embeds: [embed] }).catch(e => { });

    } catch (e) {
      const errorNotifer = require("../functions.js")
     errorNotifer(client, interaction, e, lang)
      }
  },
}
