const { ApplicationCommandOptionType } = require('discord.js')
const db = require("../mongoDB");
module.exports = {
  name: "help",
  description: "Список команд.",
  permissions: "0x0000000000000800",
  options: [
  ],
  showHelp: false,
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction.guild.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);
    try {
      const { EmbedBuilder } = require('discord.js');
      const info = interaction.options.getString('info');
      if (info) {
        const cmd_filter = client.commands.filter(x => x.name === info);
        if (!cmd_filter.length > 0) return interaction.reply({ content: lang.msg127, ephemeral: true }).catch(e => { })

        const cmd = cmd_filter[0]
        const embed = new EmbedBuilder()
          .setTitle(`Command Info: ${cmd.name}`)
          .setDescription(`> **Описание: \`${cmd.description}\`**\n> **Опция:**\n${cmd?.options?.map(x => `> **\`${x.name}\` - \`${x.description}\`**`).join("\n")}`)
          .setColor(client.config.embedColor)
          .setTimestamp()
        return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { })

      } else {
        const commands = client.commands.filter(x => x.showHelp !== false);

        const embed = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTitle("Список доступных команд")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(`**>>> \`/autoplay\` - Переключить автовосроизведение очереди\n\`/back\` - Вернутся на предыдущий трек\n\`/about\` - Посмотреть информацию о боте\n\`/clear\` - Очистить музыкальную очередь\n\`/filter\` - Установить фильтр на трек\n\`/help\` - Список команд\n\`/loop\` - Зациклить воспроизведение трека\n\`/nowplaying\` - Информация о треке\n\`/pause\` - Поставить трек на паузу\n\`/play\` - Воспроизвести новый трек\n\`/queue\` - Музыкальная очередь\n\`/resume\` - Возобновить прогрывание трека\n\`/search\` - Найти треки (не больше 10 результатов)\n\`/seek\` - Перемотать трек\n\`/shuffle\` - Перемешать музыкальную очередь\n\`/skip\` - Пропустить трек\n\`/stop\` - Остановить проигрывание трека\n\`/time\` - Узнать время проигрывания трека\n\`/volume\` - Поменять громкость трека**`)
          .setTimestamp()
          .setFooter({ text: `Botom` })
        interaction.reply({ embeds: [embed]}).catch(e => { })
      }

    } catch (e) {
      const errorNotifer = require("../functions.js")
     errorNotifer(client, interaction, e, lang)
      }
  },
};
