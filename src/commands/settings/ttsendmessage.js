import Ticket_Schema from "../../utils/database/Ticket_Schema.js";
import { ActionRowBuilder, ButtonBuilder } from "discord.js"

export const data = {
    name: "ttsendmessage",
    description: "Destek paneli için yazı ve butonu atar.",
    cooldown: 5,
    async execute(interaction) {
        if (interaction.type === 0) return    
        if (!interaction.isButton()) return
        if(!interaction.member.permissions.has('ADMINISTRATOR')) return


        let buttonName = "Talep Oluştur"
        let msg = `Talep kanalımıza hoş geldiniz.\nHerhangi bir sorununuz varsa, lütfen aşağıdaki **${buttonName}** butonuna basarak ekibimizle iletişime geçin!`
        let buttonColor = "Primary"
        let buttonEmoji = "1216391887116832828"//

        const savedGuilds = await Ticket_Schema.findOne({ guild_id: interaction.guild.id });

        if (savedGuilds) {
            if (savedGuilds.buttonName) {
                buttonName = savedGuilds.buttonName;
                msg = `Talep kanalımıza hoş geldiniz.\nHerhangi bir sorununuz varsa, lütfen aşağıdaki **${savedGuilds.buttonName}** butonuna basarak ekibimizle iletişime geçin!`;
            }
    
            if (savedGuilds.msg) msg = savedGuilds.msg;
    
            if (savedGuilds.buttonColor) buttonColor = savedGuilds.buttonColor;
    
            if (savedGuilds.buttonEmoji) buttonEmoji = savedGuilds.buttonEmoji;
        }

        
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('createticket')
                    .setLabel(buttonName)
                    .setStyle(buttonColor)
                    .setEmoji(buttonEmoji)
            );

        interaction.update({ content: msg, components: [row] }).catch((error) => { error.message });
    }
};  
