const { EmbedBuilder } = require("discord.js")
const config = require("../config.js");
const db = require("../mongoDB");
module.exports = {
  name: "shuffle",
  description: "Перемешать музыкальную очередь.",
  options: [],
  permissions: "0x0000000000000800",
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
        try {
          queue.shuffle(interaction)
          const embed = new EmbedBuilder()
          .setDescription(`<@${interaction.user.id}>, ${lang.msg133}`)
          .setColor(client.config.embedColor);
        return interaction.reply({embeds: [embed]}).catch(e => { })
        } catch(err) {
          const embed = new EmbedBuilder()
          .setDescription(`**${err}**`)
          .setColor(client.config.errorColor);
        return interaction.reply({embeds: [embed]}).catch(e => { })
        }
      } catch (e) {
        const errorNotifer = require("../functions.js")
       errorNotifer(client, interaction, e, lang)
        }
  },
};
