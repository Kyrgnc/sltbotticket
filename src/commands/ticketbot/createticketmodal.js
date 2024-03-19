import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js"
import Ticket_Schema from "../../utils/database/Ticket_Schema.js";

export const data = {
  name: "createticketmodal",
  description: "Kullanıcı için modal kutusunu açar",
  cooldown: 5,
  async execute(interaction) {
    if (interaction.type === 0) return
    if (!interaction.isModalSubmit()) return

    const member = interaction.member

    const modalArea1 = interaction.components[0].components[0].value;
    const modalArea2 = interaction.components[1].components[0].value;
    const modalCustomId = interaction.components[2].components[0].customId;
    const modalMsg = interaction.components[2].components[0].value;

    let menutopics = false
    const savedGuilds = await Ticket_Schema.findOne({ guild_id: interaction.guild.id });
    if (savedGuilds && savedGuilds.menutopics) menutopics = savedGuilds.menutopics

    const title = menutopics.split(',')[parseInt(modalCustomId) - 1]


    if (savedGuilds && savedGuilds.channelconfirm) {

      const channel = interaction.guild.channels.cache.get(savedGuilds.channelconfirm);
      if (channel) {

        const response = new EmbedBuilder()
          .setAuthor({ name: title })
          .setDescription(`**Video Url**:\n${modalArea1}\n**Karakter İsmi**:\n${modalArea2}\n**Talep:**\n${modalMsg}`)
          .addFields(
            { name: '**Talep Oluşturan:**', value: `${member} **([${member.user.username}](https://discord.com/users/${member.id}))**`, inline: true },
          )
          .setColor("Blue")
          .setFooter({ text: '• COPYRİGHT 2024 Ticket Bot', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('confirmticket')
              .setLabel("Cevapla")
              .setStyle("Primary")
          );

        channel.send({ embeds: [response], components: [row] });        
        interaction.update({ embeds: [response], components: [] })

      } else {
        interaction.update({ content: "Hata: Yöneticinin bilmesi gereken hata. Onay kanalı bulunamadı veya ayarlamadı.", components: [] })
      }

    }
    else {

    }


  }
};