import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js"
import Ticket_Schema from "../../utils/database/Ticket_Schema.js";

export const data = {
    name: "ttsettingsbtnrolecaddedit",
    description: "Destek taleplerinin oluşturacak rolü (ekle) günceller",
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

                const edited = await addOrNoadd(schema.rolecreated, roleId);
                schema.rolecreated = edited;
                await schema.save();

                response
                    .setDescription(`**Destek taleplerinin oluşturacak rol** başarılı bir şekilde eklenerek güncellendi.\n\n${roleId}`)
                    .setColor("Green")
                interaction.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
            })
            .catch(async (error) => {
                response
                    .setDescription(`**Destek taleplerinin oluşturacak rol** başarılı bir şekilde eklenerek güncellendi.\n\n${roleId}`)
                    .setColor("Green")
                interaction.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
                await Ticket_Schema.updateOne({ guild_id: interaction.guild.id }, { $set: { rolecreated: roleId } });
            });


    }
};


function addOrNoadd(ids, addid) {
    const idDizisi = ids.split(',');

    if (!idDizisi.includes(addid)) {
        idDizisi.push(addid);
    }

    const sonucString = idDizisi.join(',');
    return sonucString;
}