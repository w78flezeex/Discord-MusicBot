module.exports = {
TOKEN: "Сюда свой токен бота",
ownerID: ["Сюда свой айди"], 
botInvite: "Сюда вставте приглошение бота", //write your discord bot invite.
supportServer: "Дс сервер бота", 
mongodbURL: "mongodb+srv://skylinediscord05:extern@cluster0.xebwlv0.mongodb.net/?retryWrites=true&w=majority",
status: '/help',
commandsDir: './commands', 
language: "ru", 
embedColor: "cfcae3",
errorColor: "ff0000",
errorLog: "1085546657824907364", 


monitoring: {
status: false, 
url: "https://botom.statuspage.io/", 
},

voteManager: { 
status: false, 
api_key: "", 
vote_commands: ["back","channel","clear","dj","filter","loop","nowplaying","pause","play","playlist","queue","resume","save","search","skip","stop","time","volume"], //write your use by vote commands.
vote_url: "",
},

shardManager:{
shardStatus: true 
},

playlistSettings:{
maxPlaylist: 10, 
maxMusic: 75, 
},

opt: {
DJ: {
commands: ['back', 'clear', 'filter', 'loop', 'pause', 'resume', 'skip', 'stop', 'volume', 'shuffle'] //Please don't touch
},

voiceConfig: {
leaveOnFinish: true, 
leaveOnStop: true, 

leaveOnEmpty: { 
status: true, 
cooldown: 100000000, 
},

},

maxVol: 150, 

}
}
