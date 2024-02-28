const { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Distube } = require('distube');
const db = require("../mongoDB");
module.exports = {
  name: "play",
  description: "Начать проигрывание песни.",
  permissions: "0x0000000000000800",
  options: [
        {
          name: "name",
          description: "Напишите свое музыкальное название.",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ], 
  voiceChannel: true,
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction.guild.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);

    try {
      let stp = interaction.options.getString()

      if (stp === "playlist") {
        let playlistw = interaction.options.getString('name')
        let playlist = await db?.playlist?.find().catch(e => { })
        if (!playlist?.length > 0) return interaction.reply({ content: lang.msg52, ephemeral: true }).catch(e => { })

        let arr = 0
        for (let i = 0; i < playlist.length; i++) {
          if (playlist[i]?.playlist?.filter(p => p.name === playlistw)?.length > 0) {

            let playlist_owner_filter = playlist[i].playlist.filter(p => p.name === playlistw)[0].author
            let playlist_public_filter = playlist[i].playlist.filter(p => p.name === playlistw)[0].public

            if (playlist_owner_filter !== interaction.member.id) {
              if (playlist_public_filter === false) {
                return interaction.reply({ content: lang.msg53, ephemeral: true }).catch(e => { })
              }
            }

            const music_filter = playlist[i]?.musics?.filter(m => m.playlist_name === playlistw)
            if (!music_filter?.length > 0) return interaction.reply({ content: lang.msg54, ephemeral: true }).catch(e => { })

            interaction.reply({ content: lang.msg56 }).catch(e => { })

            let songs = []
            music_filter.map(m => songs.push(m.music_url))

            setTimeout(async () => {
              const playl = await client?.player?.createCustomPlaylist(songs, {
                member: interaction.member,
                properties: { name: playlistw, source: "custom" },
                parallel: true
              });

              await interaction.editReply({ content: lang.msg57.replace("{interaction.member.id}", interaction.member.id).replace("{music_filter.length}", music_filter.length) }).catch(e => { })

              try {
                await client.player.play(interaction.member.voice.channel, playl, {
                  member: interaction.member,
                  textChannel: interaction.channel,
                  interaction
                })
              } catch (e) {
                const embed = new EmbedBuilder()
                  .setDescription(lang.msg60)
                  .setColor(client.config.errorColor);
                await interaction.editReply({ embeds: [embed], ephemeral: true }).catch(e => { });
              }

              playlist[i]?.playlist?.filter(p => p.name === playlistw).map(async p => {
                await db.playlist.updateOne({ userID: p.author }, {
                  $pull: {
                    playlist: {
                      name: playlistw
                    }
                  }
                }, { upsert: true }).catch(e => { })

                await db.playlist.updateOne({ userID: p.author }, {
                  $push: {
                    playlist: {
                      name: p.name,
                      author: p.author,
                      authorTag: p.authorTag,
                      public: p.public,
                      plays: Number(p.plays) + 1,
                      createdTime: p.createdTime
                    }
                  }
                }, { upsert: true }).catch(e => { })
              })
            }, 3000)
          } else {
            arr++
            if (arr === playlist.length) {
              return interaction.reply({ content: lang.msg58, ephemeral: true }).catch(e => { })
            }
          }
        }
      }
      const name = interaction.options.getString('name');
      if (!name) {
        const embed = new EmbedBuilder()
          .setDescription(lang.msg59)
          .setColor(client.config.errorColor);
        return interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => {} );
      }
      
      const embed = new EmbedBuilder()
      .setDescription(lang.msg61)
      .setColor(client.config.embedColor);
      const reply = await interaction.reply({ embeds: [embed] }).catch(e => {}).then((msg) => {
 setTimeout(() => {
  msg.delete().catch((e) => {});
}, 5000); // 5 секунд и бот нахуй удаляет это сообщение 
});

    const delay = 10000;

    let channel = interaction.member.voice.channel;

    if (!channel || !channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel)) {
      return interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setDescription(`К сожалению, я не могу обнаружить канал в котором вы находитесь!`)
            .setColor(client.config.errorColor)
        ],
      });
    }

    if (!channel.permissionsFor(client.user).has(PermissionFlagsBits.Connect) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.Speak)) {
      return interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setDescription('К сожалению, у меня недостаточно прав, для подключения к этому каналу!')
            .setColor(client.config.errorColor)
        ],
      });
    }

    setTimeout(() => {
      if (reply && !reply.deleted) {
        reply.delete().catch(e => {});
      }
    }, delay);
      
      try {
        await client.player.play(interaction.member.voice.channel, name, {
          member: interaction.member,
          textChannel: interaction.channel,
          interaction,
        });
      } catch (e) {
        const embed = new EmbedBuilder()
          .setDescription(lang.msg60)
          .setColor(client.config.errorColor);
      
      
        await interaction.editReply({ embeds: [embed], ephemeral: true }).catch(e => {} );
        }
    } catch (e) {
      const errorNotifer = require("../functions.js")
     errorNotifer(client, interaction, e, lang)
      }
  },
};
