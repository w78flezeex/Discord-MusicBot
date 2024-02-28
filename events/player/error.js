module.exports = async (client, textChannel, e) => {
if (textChannel){
   return textChannel?.send(`**Обнаружена ошибка:** ${e.toString().slice(0, 1974)}`)
}
}
