const {EmbedBuilder } = require('discord.js');
const db = require("../mongoDB");
module.exports = {
  name: "stop",
  description: "Остановить проигрывание песни.",
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
      .setColor(client.config.errorColor)
      .setDescription(lang.msg5);
      return interaction.reply({embeds: [embed], ephemeral: true }).catch(e => { })};
      queue.stop(interaction.guild.id);
      const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setDescription(lang.msg85);
      return interaction.reply({embeds: [embed]}).catch(e => { })

    } catch (e) {
      const errorNotifer = require("../functions.js")
     errorNotifer(client, interaction, e, lang)
      }
  },
};
