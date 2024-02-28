const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const maxVol = require("../config.js").opt.maxVol;
const db = require("../mongoDB");
module.exports = {
  name: "volume",
  description: "Изменить громкость музыки.",
  permissions: "0x0000000000000800",
  options: [{
    name: 'volume',
    description: 'Введите число, чтобы отрегулировать громкость.',
    type: ApplicationCommandOptionType.Integer,
    required: true
  }],
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

      const vol = parseInt(interaction.options.getInteger('volume'));

      if (!vol) {
      const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setDescription(lang.msg87.replace("{queue.volume}", queue.volume).replace("{maxVol}", maxVol));  
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { })};

      if (queue.volume === vol) {
      const embed = new EmbedBuilder()  
      .setColor(client.config.errorColor)
      .setDescription(lang.msg88);
      return interaction.reply({embeds: [embed], ephemeral: true }).catch(e => { })};

      if (vol < 0 || vol > maxVol) {
      const embed = new EmbedBuilder()
      .setColor(client.config.errorColor)
      .setDescription(lang.msg89.replace("{maxVol}", maxVol));
      return interaction.reply({embeds: [embed], ephemeral: true }).catch(e => { })};

      const success = queue.setVolume(vol);
  
      const embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setDescription(success ? `${lang.msg90} **${vol}**/**${maxVol}** 🔊` : lang.msg41);
      interaction.reply({ embeds: [embed] }).catch(e => { console.error(e); });

    } catch (e) {
      const errorNotifer = require("../functions.js")
     errorNotifer(client, interaction, e, lang)
    }
  },
};

