const config = require("../config.js");
const { EmbedBuilder, InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const db = require("../mongoDB");
const fs = require("fs")  
module.exports = async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);
try {
if (!interaction?.guild){
return interaction?.reply({ content: "Пожалуйста, используй бота на сервере а не в личных сообщениях.", ephemeral: true })
} else {

    function cmd_loader() {
        if (interaction?.type === InteractionType.ApplicationCommand) {
            fs.readdir(config.commandsDir, (err, files) => {
            if (err) throw err;
            files.forEach(async (f) => {
            let props = require(`.${config.commandsDir}/${f}`);
            if (interaction.commandName === props.name) {
            try {
            let data = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id })
            if (data?.channels?.length > 0) {

            let channel_control = await data?.channels?.filter(x => !interaction?.guild?.channels?.cache?.get(x?.channel))
          
            if (channel_control?.length > 0) {
            for (const x of channel_control) {
                await db?.musicbot?.updateOne({ guildID: interaction?.guild?.id }, { 
                    $pull: { 
                        channels: { 
                            channel: x?.channel
                        } 
                    } 
                }, { upsert: true }).catch(e => { })
            }
           
            } else {
            data = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id })
            let channel_filter = data?.channels?.filter(x => x.channel === interaction?.channel?.id)



            if (!channel_filter?.length > 0 && !interaction?.member?.permissions?.has("0x0000000000000020")) {
            channel_filter = data?.channels?.map(x => `<#${x.channel}>`).join(", ")
            .setDescription(lang.msg126.replace("{channel_filter}", channel_filter))
            .setColor(client.config.embedColor);
            return interaction?.reply({ embeds: [embed], ephemeral: true }).catch(e => { })
            }
        }
            }
            if (interaction?.member?.permissions?.has(props?.permissions || "0x0000000000000800")) {
            const DJ = client.config.opt.DJ;
            if (props && DJ.commands.includes(interaction?.commandName)) {
            let djRole = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id }).catch(e => { });
            if (djRole) {
            const roleDJ = interaction?.guild?.roles?.cache?.get(djRole?.role)
            if (!interaction?.member?.permissions?.has("0x0000000000000020")) {
            if (roleDJ) {
            if (!interaction?.member?.roles?.cache?.has(roleDJ?.id)) {
            
            const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setTitle(client?.user?.username)
            .setThumbnail(client?.user?.displayAvatarURL())
            .setDescription(lang.embed1.replace("{djRole}", roleDJ?.id).replace("{cmdMAP}", client.config.opt.DJ.commands.map(astra => '`' + astra + '`').join(", ")))
            .setTimestamp()
            .setFooter({ text: `Ayoka` })
            return interaction?.reply({ embeds: [embed], ephemeral: true }).catch(e => { })
            }
            }
        
            }
            }
            }
            if (props && props.voiceChannel) {
            if (!interaction?.member?.voice?.channelId) {
            const embed = new EmbedBuilder()
                .setDescription(`${lang.message1}`)
                .setColor(client.config.errorColor);
            return interaction?.reply({ embeds: [embed], ephemeral: true }).catch(e => { })};
            const guild_me = interaction?.guild?.members?.cache?.get(client?.user?.id);
            if (guild_me?.voice?.channelId) {
            if (guild_me?.voice?.channelId !== interaction?.member?.voice?.channelId) {
                const embed = new EmbedBuilder()
                .setDescription(`${lang.message2}`)
                .setColor(client.config.errorColor);
            return interaction?.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
            }
            }
            }
            return props.run(client, interaction);
            
            } else {
                const embed = new EmbedBuilder()
                .setDescription(`${lang.message3}: **${props?.permissions?.replace("0x0000000000000020", "MANAGE GUILD")?.replace("0x0000000000000800", "SEND MESSAGES") || "SEND MESSAGES"}**`)
                .setColor(client.config.errorColor);
            return interaction?.reply({ embeds: [embed], ephemeral: true });
            }
            } catch (e) {
            return interaction?.reply({ content: `${lang.msg4}...\n\n\`\`\`${e?.message}\`\`\``, ephemeral: true });
            }
            }
            });
            });
            }
    }

    if(config.voteManager.status === true && config.voteManager.api_key){
        if(config.voteManager.vote_commands.includes(interaction?.commandName)){
            try {
            const topSdk = require("@top-gg/sdk");
            let topApi = new topSdk.Api(config.voteManager.api_key, client);
            await topApi?.hasVoted(interaction?.user?.id).then(async voted => {
                if (!voted) {
            const embed2 = new EmbedBuilder()
          .setTitle("Vote "+client?.user?.username)
          .setColor(client?.config?.embedColor)
          .setDescription(`${config.voteManager.vote_commands.map(cs => `\`${cs}\``).join(", ")} - ${lang.msg131}
> ${config.voteManager.vote_url}`)
            return interaction?.reply({ content:"", embeds: [embed2], ephemeral: true })
                } else {
                    cmd_loader()
                }
            })
        } catch(e){
            cmd_loader()
        }
        } else {
            cmd_loader()
        }
        } else {
            cmd_loader()
        }


if (interaction?.type === InteractionType.MessageComponent) {
const queue = client?.player?.getQueue(interaction?.guildId);
switch (interaction?.customId) {
case 'saveTrack': {
if (!queue || !queue?.playing) {
return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], ephemeral: true }).catch(e => { })
} else {

const Modal = new ModalBuilder()
.setCustomId("playlistModal")
.setTitle(lang.msg6)

const PlayList = new TextInputBuilder()
.setCustomId("playlist")
.setLabel(lang.msg7)
.setRequired(true)
.setStyle(TextInputStyle.Short)

const PlaylistRow = new ActionRowBuilder().addComponents(PlayList);

Modal.addComponents(PlaylistRow)

await interaction?.showModal(Modal).catch(e => { })
}
}
break
case 'timesTrack': {
  if (!interaction.member.voice.channelId) {
    const embed = new EmbedBuilder()
      .setDescription(`${lang.message1}`)
      .setColor(client.config.errorColor);
    return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
  }

  const guild_me = interaction.guild.members.cache.get(client.user.id);
  if (guild_me.voice.channelId && guild_me.voice.channelId !== interaction.member.voice.channelId) {
    const embed = new EmbedBuilder()
      .setDescription(`${lang.message2}`)
      .setColor(client.config.errorColor);
    return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
  }

if (!queue || !queue?.playing) {
    const embed = new EmbedBuilder()
    .setDescription(lang.msg5)
    .setColor(client.config.errorColor);
return interaction?.reply({ embeds: [embed], ephemeral: true }).catch(e => { })
} else {

    let music_percent = queue.duration / 100;
    let music_percent2 = queue.currentTime / music_percent;
    let music_percent3 = Math.round(music_percent2);

    const embed = new EmbedBuilder()
    .setColor(client.config.embedColor)
    .setTitle(`Время воспроизведения трека`)
    .setTimestamp()
    .setDescription(`**${queue?.formattedCurrentTime} / ${queue?.formattedDuration} (${music_percent3}%)**`)
    .setFooter({ text: `Ayoka` })
    return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
}
}
break
case 'stopTrack': {
    if (!interaction.member.voice.channelId) {
      const embed = new EmbedBuilder()
        .setDescription(`${lang.message1}`)
        .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
    }
  
    const guild_me = interaction.guild.members.cache.get(client.user.id);
    if (guild_me.voice.channelId && guild_me.voice.channelId !== interaction.member.voice.channelId) {
      const embed = new EmbedBuilder()
        .setDescription(`${lang.message2}`)
        .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
    }
  
    const queue = client.player.getQueue(interaction.guild.id);
    if (!queue || !queue.playing) {
      const embed = new EmbedBuilder()
        .setColor(client.config.errorColor)
        .setDescription(lang.msg5);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
    } else {
      queue.stop(interaction.guild.id);
      const embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setDescription(lang.msg85);
      return interaction.reply({ embeds: [embed] }).catch(e => { });
             
}
}
break
case 'resumeTrack': {
    if (!interaction.member.voice.channelId) {
      const embed = new EmbedBuilder()
        .setDescription(`${lang.message1}`)
        .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
    }
  
    const guild_me = interaction.guild.members.cache.get(client.user.id);
    if (guild_me.voice.channelId && guild_me.voice.channelId !== interaction.member.voice.channelId) {
      const embed = new EmbedBuilder()
        .setDescription(`${lang.message2}`)
        .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
    }
  
    const queue = client.player.getQueue(interaction.guild.id);
    if (!queue) {
      const embed = new EmbedBuilder()
        .setDescription(lang.msg63)
        .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], components: [], ephemeral: true }).catch(e => {});
    }
    if (!queue.paused) {
      const embed = new EmbedBuilder()
        .setDescription(lang.msg132)
        .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], components: [], ephemeral: true }).catch(e => {});
    } else {
      const success = queue.resume();
      const embed = new EmbedBuilder()
        .setDescription(success ? `${lang.msg72}` : lang.msg71)
        .setColor(client.config.embedColor);
      return interaction.reply({ embeds: [embed] }).catch(e => {});
    
}
}
break
case 'pauseTrack': {
    if (!interaction.member.voice.channelId) {
      const embed = new EmbedBuilder()
        .setDescription(`${lang.message1}`)
        .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
    }
  
    const guild_me = interaction.guild.members.cache.get(client.user.id);
    if (guild_me.voice.channelId && guild_me.voice.channelId !== interaction.member.voice.channelId) {
      const embed = new EmbedBuilder()
        .setDescription(`${lang.message2}`)
        .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
    }
  
    const queue = client.player.getQueue(interaction.guild.id);
    if (!queue || !queue.playing) {
      const embed = new EmbedBuilder()
        .setDescription(lang.msg5)
        .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
    } else {
      const success = queue.pause();
      const embed = new EmbedBuilder()
        .setDescription(success ? `${lang.msg48}` : lang.msg41)
        .setColor(client.config.embedColor);
      return interaction.reply({ embeds: [embed] }).catch(e => { });
    
}
}
break
case 'skipTrack': {
    if (!interaction.member.voice.channelId) {
      const embed = new EmbedBuilder()
        .setDescription(`${lang.message1}`)
        .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
    }
  
    const guild_me = interaction.guild.members.cache.get(client.user.id);
    if (guild_me.voice.channelId && guild_me.voice.channelId !== interaction.member.voice.channelId) {
      const embed = new EmbedBuilder()
        .setDescription(`${lang.message2}`)
        .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
    }
  
    const queue = client.player.getQueue(interaction.guild.id);
    if (!queue || !queue.playing) {
      const embed = new EmbedBuilder()
        .setDescription(lang.msg5)
        .setColor(client.config.errorColor);
      return interaction.reply({ embeds: [embed], components: [], ephemeral: true }).catch(e => { });
    } else {
      try {
        let old = queue.songs[0];
        const success = await queue.skip();
        const embed = new EmbedBuilder()
          .setDescription(success ? `${lang.msg83}` : lang.msg41)
          .setColor(client.config.embedColor);
        return interaction.reply({ embeds: [embed] }).catch(e => { });
      } catch (e) {
        const embed = new EmbedBuilder()
          .setDescription(lang.msg63)
          .setColor(client.config.errorColor);
        return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => { });
    }
  }
}
}
}
}
} catch (e) {
  const errorNotifer = require("../functions.js")
 errorNotifer(client, interaction, e, lang)
}
}



