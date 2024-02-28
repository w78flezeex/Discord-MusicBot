const { EmbedBuilder } = require('discord.js')
const db = require("../mongoDB");
module.exports = {
  name: "autoplay",
  description: "Переключить автовоспроизведение очереди.",
  options: [],
  permissions: "0x0000000000000800",
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id }).catch(e => {})
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);
    try {
        const queue = client?.player?.getQueue(interaction?.guild?.id);
        if (!queue || !queue?.playing) {
        const embed = new EmbedBuilder()
        .setDescription(lang.msg5)
        .setColor(client.config.errorColor);
        return interaction?.reply({ embeds: [embed], ephemeral: true }).catch(e => { })};
        queue?.toggleAutoplay()
        const embed = new EmbedBuilder()
        .setDescription(queue?.autoplay ? lang.msg136 : lang.msg137)
        .setColor(client.config.embedColor);
        interaction?.reply({ embeds: [embed], ephemeral: true })
    
      } catch (e) {
        const errorNotifer = require("../functions.js")
       errorNotifer(client, interaction, e, lang)
        }
  },
};
