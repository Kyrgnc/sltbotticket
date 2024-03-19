import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionsBitField, ChannelType, MessagePayload } from "discord.js"
import Ticket_Schema from "../../utils/database/Ticket_Schema.js";
import TicketCount_Schema from "../../utils/database/TicketCount_Schema.js";

export const data = {
  name: "confirmticket",
  description: "Moderator tarafından onay sonrası kanal açar.",
  cooldown: 1,
  async execute(interaction) {
    if (interaction.type === 0) return
    if (!interaction.isButton()) return

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

    const readedUser = interaction.message.embeds[0].fields[0].value
    const userId = getUserIdFromMention(readedUser)

    if (parseInt(userId) < 9007199254740992 || parseInt(userId) > 9223372036854775806) {
      interaction.update({ content: "Kullanıcı ID'si geçersiz." }).catch((error) => { error.message });
      return;
    }

    const user = await interaction.guild.members.fetch(userId).catch((error) => { error.message });

    if (!user) {
      interaction.update({ content: "Kullanıcı Sunucuda bulunamadı." }).catch((error) => { error.message });
      return;
    }

    const member = interaction.member

    if (savedGuilds && savedGuilds.categoryconfirm) {

      if (parseInt(savedGuilds.categoryconfirm) < 9007199254740992 || parseInt(savedGuilds.categoryconfirm) > 9223372036854775806) {
        interaction.update({ content: "Hata: Yöneticinin bilmesi gereken hata. Kategori bulunamadı veya ayarlamadı.", components: [] })
        return;
      }

      const category = interaction.guild.channels.cache.get(savedGuilds.categoryconfirm);

      if (!category || (category && category.type !== 4)) {
        interaction.update({ content: "Hata: Yöneticinin bilmesi gereken hata. Kategori bulunamadı veya ayarlamadı.", components: [] })
        return;
      }

      if (category) {

        const overwrites = [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel] },
        ];

        if (savedGuilds.roleconfirm) {
          const rolePromises = savedGuilds.roleconfirm.split(',').filter(item => item !== '').map(async id => {
            if (parseInt(id) < 9007199254740992 || parseInt(id) > 9223372036854775806) return null;
        
            const role = await interaction.guild.roles.fetch(id).catch((error) => { error.message });
            return role ? { id: `${id}`, allow: [PermissionsBitField.Flags.ViewChannel] } : null;
          });
        
          const resolvedRoles = await Promise.all(rolePromises);
          overwrites.push(...resolvedRoles.filter(role => role !== null));
        }

        const ticketChannel = await interaction.guild.channels.create({
          name: `Talep-${user.user.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: overwrites,
          topic: user.id,
          parent: category.id,
        });

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ticketclosed")
                .setLabel('Sonlandır')
                .setStyle('Danger')
        );
      
        await ticketChannel.send({ content: `<@${user?.id}>`, embeds: [interaction.message.embeds[0]], components: [row] })

        interaction.message.delete();
        await TicketCount_Schema.updateOne({ guild_id: interaction.guild.id, user_id: interaction.member.id }, { $inc: { count: 1 } });


      } else {
        interaction.update({ content: "Hata: Yöneticinin bilmesi gereken hata. Onaylanan taleplerin düşeceği kategori bulunamadı veya ayarlamadı.", components: [] })
      }

    }
    else {

    }


  }
};

function getUserIdFromMention(mention) {
  const userIdRegex = /<@(\d+)>/;
  const match = mention.match(userIdRegex);

  if (match) {
    return match[1];
  } else {
    return null;
  }
}