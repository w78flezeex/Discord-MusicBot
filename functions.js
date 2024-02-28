function errorNotifer(client, interaction, e, lang) {
const { EmbedBuilder } = require("discord.js")
if(client.errorLog){

    if(client.shard){
        let embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTimestamp()
        .addFields([
            { name: "Команда", value: `${interaction?.commandName}` },
            { name: "Ошибка", value: `${e.stack}` },
            { name: "Юзер", value: `${interaction?.user?.tag} \`(${interaction?.user?.id})\``, inline: true },
            { name: "Гильдия", value: `${interaction?.guild?.name} \`(${interaction?.guild?.id})\` - \`${interaction?.guild?.memberCount} members\``, inline: true },
            { name: "Время", value: `<t:${Math.floor(Date.now()/1000)}:R>`, inline: true },
            { name: "Канал использования команд", value: `${interaction?.channel?.name} \`(${interaction?.channel?.id})\``, inline: true },
            { name: "Голосовой канал юзера", value: `${interaction?.member?.voice?.channel?.name} \`(${interaction?.member?.voice?.channel?.id})\``, inline: true },
        ])
     client.shard.broadcastEval(async (c, { channelId, embed}) => {
           let channel = c.channels.cache.get(channelId);
           channel?.send({ embeds: [embed] }).catch(e => { })
      }, { context: { channelId: client?.errorLog, embed: embed } })

    } else {
        let embed = new EmbedBuilder()
.setColor(client.config.embedColor)
.setTimestamp()
.addFields([
    { name: "Команда", value: `${interaction?.commandName}` },
    { name: "Ошибка", value: `${e.stack}` },
    { name: "Юзер", value: `${interaction?.user?.tag} \`(${interaction?.user?.id})\``, inline: true },
    { name: "Гильдия", value: `${interaction?.guild?.name} \`(${interaction?.guild?.id})\``, inline: true },
    { name: "Время", value: `<t:${Math.floor(Date.now()/1000)}:R>`, inline: true },
    { name: "Канал использования команд", value: `${interaction?.channel?.name} \`(${interaction?.channel?.id})\``, inline: true },
    { name: "Голосовой канал юзера", value: `${interaction?.member?.voice?.channel?.name} \`(${interaction?.member?.voice?.channel?.id})\``, inline: true },
])
client.channels.cache.get(client?.errorLog)?.send({ embeds: [embed] }).catch(e => { })
    }

    } else {
    console.log(`
    Команда: ${interaction?.commandName}
    Ошибка: ${e}
    Юзер: ${interaction?.user?.tag} (${interaction?.user?.id})
    Гильдия: ${interaction?.guild?.name} (${interaction?.guild?.id})
    Канал использования команд: ${interaction?.channel?.name} (${interaction?.channel?.id})
    Голосовой канал юзера: ${interaction?.member?.voice?.channel?.name} (${interaction?.member?.voice?.channel?.id})
    `)
    }
    return interaction.reply({ content: `${lang.error7}\n\`${e}\``, ephemeral: true }).catch(e => { })

}

module.exports = errorNotifer;
