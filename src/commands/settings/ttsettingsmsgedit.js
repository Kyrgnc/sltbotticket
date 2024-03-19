import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js"
import Ticket_Schema from "../../utils/database/Ticket_Schema.js";

export const data = {
    name: "ttsettingsmsgedit",
    description: "Mesaj bildirisini günceller",
    cooldown: 5,
    async execute(interaction) {
        if (interaction.type === 0) return
        if (!interaction.isModalSubmit()) return
        if(!interaction.member.permissions.has('ADMINISTRATOR')) return


        const msg = interaction.components[0].components[0].value;

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

        await Ticket_Schema.updateOne({ guild_id: interaction.guild.id }, { $set: { msg: msg } }, { upsert: true })
            .then(() => {
                response
                    .setDescription(`**Mesaj bildirisi** başarılı bir şekilde güncellendi.\n\n${msg}`)
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