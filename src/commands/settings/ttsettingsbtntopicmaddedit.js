import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js"
import Ticket_Schema from "../../utils/database/Ticket_Schema.js";

export const data = {
    name: "ttsettingsbtntopicmaddedit",
    description: "Destek konularını (çıkar) günceller",
    cooldown: 5,
    async execute(interaction) {
        if (interaction.type === 0) return
        if (!interaction.isModalSubmit()) return
        if(!interaction.member.permissions.has('ADMINISTRATOR')) return


        const topicString = interaction.components[0].components[0].value;

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


        await Ticket_Schema.findOne({ guild_id: interaction.guild.id })
            .then(async schema => {

                const edited = await addOrNoadd(schema.menutopics, topicString);
                schema.menutopics = edited;
                await schema.save();

                response
                    .setDescription(`**Destek taleplerinin oluşturacak rol** başarılı bir şekilde eklenerek güncellendi.\n\n${topicString}`)
                    .setColor("Green")
                interaction.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
            })
            .catch(async (error) => {
                response
                    .setDescription(`**Destek taleplerinin oluşturacak rol** başarılı bir şekilde eklenerek güncellendi.\n\n${topicString}`)
                    .setColor("Green")
                interaction.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
                await Ticket_Schema.updateOne({ guild_id: interaction.guild.id }, { $set: { menutopics: topicString } });
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