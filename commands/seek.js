const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const db = require("../mongoDB");
module.exports = {
  name: "seek",
  description: "Установите положение дорожки.",
  permissions: "0x0000000000000800",
  options: [{
    name: "position",
    description: "Позиция для установки",
    type: ApplicationCommandOptionType.String,
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
      .setDescription(lang.msg5)
      .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { })};

      let position = getSeconds(interaction.options.getString("position"))
      if(!position || isNaN(position) || position < 0) {
        const embed = new EmbedBuilder()
        .setDescription(lang.msg134)
        .setColor(client.config.errorColor);
        return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
      }

      queue.seek(position) 
      const embed = new EmbedBuilder()
      .setDescription(`${lang.msg135.replace("{queue.formattedCurrentTime}", queue.formattedCurrentTime)}`)
      .setColor(client.config.embedColor);
      interaction.reply({embeds: [embed]}).catch(e => { });

    } catch (e) {
      const errorNotifer = require("../functions.js")
     errorNotifer(client, interaction, e, lang)
      }
  },
};

function getSeconds(str) {
  var p = str.split(':')
  var s = 0
  var m = 1
  while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
  }
  return s;
}
