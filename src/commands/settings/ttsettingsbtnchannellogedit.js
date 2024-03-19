import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js"
import Ticket_Schema from "../../utils/database/Ticket_Schema.js";

export const data = {
    name: "ttsettingsbtnchannellogedit",
    description: "Kapanan Taleplerin Log kanalını günceller",
    cooldown: 5,
    async execute(interaction) {
        if (interaction.type === 0) return
        if (!interaction.isModalSubmit()) return
        if(!interaction.member.permissions.has('ADMINISTRATOR')) return


        const channelId = interaction.components[0].components[0].value;

        const response = new EmbedBuilder()
            .setAuthor({ name: "Destek Paneli Ayarları" })
            .setFooter({ text: '• COPYRİGHT 2024 Ticket Bot', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ttsettingsmenu')
                    .setLabel("Geri Gel")
                    .setStyle("Secondary"),
                new ButtonBuilder()
                    .setCustomId('ttsettingsdeletemsg')
                    .setLabel("Mesajı Sil")
                    .setStyle("Danger"),
            );


        if (parseInt(channelId) < 9007199254740992 || parseInt(channelId) > 9223372036854775806) {
            response
                .setDescription(`Hata oluştu. Kanal ID'si geçersiz.`)
                .setColor("Red")
            interaction.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
            return;
        }

        const channel = interaction.guild.channels.cache.get(channelId);

        if (!channel || (channel && channel.type !== 0)) {
            response
                .setDescription(`Hata oluştu. Kanal ID'si geçersiz.`)
                .setColor("Red")
            interaction.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
            return;
        }

        await Ticket_Schema.updateOne({ guild_id: interaction.guild.id }, { $set: { channellog: channelId } }, { upsert: true })
            .then(() => {
                response
                    .setDescription(`**Kapanan taleplerin log kanalı** başarılı bir şekilde güncellendi.\n\n${channelId}`)
                    .setColor("Green")
                interaction.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
            })
            .catch((error) => {
                response
                    .setDescription(`Hata oluştu.`)
                    .setColor("Red")
                console.log(error.message);
                interaction.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
            });


    }
};