import { ActionRowBuilder, ButtonBuilder } from "discord.js"

export const data = {
    name: "destekpaneli",
    description: "Destek panelini kurar.",
    cooldown: 5,
    async execute(interaction) {
        if (interaction.type !== 0) return       
        if(!interaction.member.permissions.has('ADMINISTRATOR')) return


        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ttsendmessage')
                    .setLabel("Bildiri Mesajını Gönder")
                    .setStyle("Primary"),
                new ButtonBuilder()
                    .setCustomId('ttsettingsmenu')
                    .setLabel("Ayarlar Menüsünü Aç")
                    .setStyle("Primary")
            );

        interaction.channel.send({ components: [row] }).catch((error) => { error.message });
        interaction.delete().catch((error) => { error.message });

    }
};  