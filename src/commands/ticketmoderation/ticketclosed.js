import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionsBitField, ChannelType, MessagePayload, AttachmentBuilder } from "discord.js"
import Ticket_Schema from "../../utils/database/Ticket_Schema.js";

export const data = {
  name: "ticketclosed",
  description: "Moderator tarafından onay sonrası kanal açar.",
  cooldown: 1,
  async execute(interaction) {
    if (interaction.type === 0) return
    if (!interaction.isButton()) return

    const member = interaction.member

    const savedGuilds = await Ticket_Schema.findOne({ guild_id: interaction.guild.id });

    let rolecntrl = false
    if (savedGuilds && savedGuilds.roleconfirm && savedGuilds.roleconfirm !== "Belirlenmedi") {
      const targetRoles = savedGuilds.roleconfirm.split(',').map(id => id).join(',');
      rolecntrl = !(interaction.member.roles.cache.some(role => targetRoles.includes(role.id)))
    }


    if (rolecntrl) {
      await interaction.reply({ content: "Bunu yapmak için yeterli role sahip değilsiniz.", ephemeral: true });
      return;
    }

    if (savedGuilds && savedGuilds.channellog) {

      if (parseInt(savedGuilds.channellog) < 9007199254740992 || parseInt(savedGuilds.channellog) > 9223372036854775806) {
        interaction.update({ content: "Hata: Yöneticinin bilmesi gereken hata. Kategori bulunamadı veya ayarlamadı.", components: [] })
        return;
      }
      const channeltopic = interaction.channel.topic;
      const joinedTimestamp = interaction.channel.createdTimestamp;
      const channelMsgSize = (await interaction.channel?.messages.fetch()).size || "Bilinmiyor";

      const channel = interaction.guild.channels.cache.get(savedGuilds.channellog);

      if (channel) {
        const message_log = (await interaction.channel?.messages.fetch({ limit: 100 }))?.map((message) => `${message.member?.displayName}(${message.member?.id}):\n${message.content}\n`).reverse();
        const logText = message_log.join('\n');
        const buffer = Buffer.from(logText, 'utf-8');

        const attachment = new AttachmentBuilder(buffer, { name: `log(${channeltopic}).txt` });


        const response = new EmbedBuilder()
          .setDescription(`\`\`Kullanıcı id      :\`\`${channeltopic}\n\`\`Sonlandıran       :\`\`${member.id}\n\`\`Toplam Mesaj      :\`\`${channelMsgSize}\n\`\`Talep Onay Zamanı :\`\`<t:${Math.round((joinedTimestamp) / 1000)}:f>\n\`\`Sonlandırma Zamanı:\`\`<t:${Math.round((Date.now()) / 1000)}:f>`)
          .setColor("Red");

        await channel.send({ embeds: [response], files: [attachment] })
        interaction.channel.delete()
      } else {
        interaction.channel.delete()
      }

    }
    else {
      interaction.channel.delete()
    }


  }
};
