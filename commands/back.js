const { EmbedBuilder } = require('discord.js')
const db = require("../mongoDB");
module.exports = {
  name: "back",
  description: "Воспроизведение предыдущей дорожки.",
  permissions: "0x0000000000000800",
  options: [],
  voiceChannel: true,
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction.guild.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);
    try {
      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) {
      const embed = new EmbedBuilder()
      .setDescription(`${lang.msg5}`)
      .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { })};
      try {
        let song = await queue.previous()
        const embed = new EmbedBuilder()
        .setDescription(`${lang.msg18.replace("{queue.previousTracks[1].title}", song.name)}`)
        .setColor(client.config.embedColor);
        interaction.reply({ embeds: [embed], }).catch(e => { });
      } catch (e) {
        const embed = new EmbedBuilder()
        .setDescription(`${lang.msg17}`)
        .setColor(client.config.errorColor);
        return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
      }
    } catch (e) {
      const errorNotifer = require("../functions.js")
     errorNotifer(client, interaction, e, lang)
      }
  },
};
