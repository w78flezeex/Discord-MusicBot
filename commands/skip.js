const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const db = require("../mongoDB");
module.exports = {
  name: "skip",
  description: "Пропустить сейчас играющую песню.",
  permissions: "0x0000000000000800",
  options: [{
    name: "number",
    description: "Введите, сколько песен вы хотите пропустить.",
    type: ApplicationCommandOptionType.Number,
    required: false
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

      let number = interaction.options.getNumber('number');
      if (number) {
        if (!queue.songs.length > number) {
        const embed = new EmbedBuilder()
        .setDescription(lang.msg82)
        .setColor(client.config.errorColor);
        return interaction.reply({embeds: [embed], ephemeral: true }).catch(e => { })};
        if (isNaN(number)) {
        const embed = new EmbedBuilder()
        .setColor(client.config.errorColor)
        .setDescription(lang.msg130);
        return interaction.reply({embeds: [embed], ephemeral: true }).catch(e => { })};
        if (1 > number) {
        const embed = new EmbedBuilder()
        .setDescription(lang.msg130)
        .setColor(client.config.errorColor);
        return interaction.reply({embeds: [embed], ephemeral: true }).catch(e => { })};

        try {
        let old = queue.songs[0];
        await client.player.jump(interaction, number).then(song => {
          const embed = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setDescription(`${lang.msg83}`);
          return interaction.reply({embeds: [embed]}).catch(e => { })
        })
      } catch(e){
        const embed = new EmbedBuilder()
        .setDescription(lang.msg63)
        .setColor(client.config.errorColor);
        return interaction.reply({embeds: [embed], ephemeral: true }).catch(e => { })
      }
      } else {
        try {
          let old = queue.songs[0];
          const success = await queue.skip();
          const embed = new EmbedBuilder()
          .setDescription(success ? `**${old.name}**, ${lang.msg83}` : lang.msg41)
          .setColor(client.config.embedColor);
          return interaction.reply({embeds: [embed]}).catch(e => { })
        } catch (e) {
          const embed = new EmbedBuilder()
          .setDescription(lang.msg63)
          .setColor(client.config.errorColor);
          return interaction.reply({embeds: [embed], ephemeral: true }).catch(e => { })
        }
      }

    } catch (e) {
      const errorNotifer = require("../functions.js")
     errorNotifer(client, interaction, e, lang)
      }
  },
};
