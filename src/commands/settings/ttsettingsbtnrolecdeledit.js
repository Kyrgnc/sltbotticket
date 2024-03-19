import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js"
import Ticket_Schema from "../../utils/database/Ticket_Schema.js";

export const data = {
    name: "ttsettingsbtnrolecdeledit",
    description: "Destek taleplerinin oluşturacak rolü (kaldırır) günceller",
    cooldown: 5,
    async execute(interaction) {
        if (interaction.type === 0) return
        if (!interaction.isModalSubmit()) return
        if(!interaction.member.permissions.has('ADMINISTRATOR')) return


        const roleId = interaction.components[0].components[0].value;

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


        if (parseInt(roleId) < 9007199254740992 || parseInt(roleId) > 9223372036854775806) {
            response
                .setDescription(`Hata oluştu. Rol ID'si geçersiz.`)
                .setColor("Red")
            interaction.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
            return;
        }

        const role = await interaction.guild.roles.fetch(roleId).catch((error) => { error.message });

        if (!role) {
            response
                .setDescription(`Hata oluştu. Rol ID'si geçersiz.`)
                .setColor("Red")
            interaction.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
            return;
        }

        await Ticket_Schema.findOne({ guild_id: interaction.guild.id })
            .then(async schema => {

                const edited = deleteOrNodelete(schema.rolecreated, roleId);
                schema.rolecreated = edited;
                await schema.save();

                response
                    .setDescription(`**Destek taleplerinin oluşturacak rol** başarılı bir şekilde kaldırılarak güncellendi.\n\n${roleId}`)
                    .setColor("Green")
                interaction.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
            })
            .catch((error) => {
                response
                    .setDescription(`Hata oluştu. Hiç bir rol bulunamadı.`)
                    .setColor("Red")
                console.log(error.message);
                interaction.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
            });


    }
};


function deleteOrNodelete(ids, delid) {
    const idDizisi = ids.split(',').filter(Boolean);

    const index = idDizisi.indexOf(delid);
    if (index !== -1) {
        idDizisi.splice(index, 1);
    }

    const sonucString = idDizisi.join(',');
    return sonucString;
}