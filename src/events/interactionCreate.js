import cooldown_control from "../utils/cooldown_control.js";
import { EmbedBuilder } from "discord.js"

export default client => {

    const { embed } = client
    client.on('interactionCreate', interaction => {
        if (!interaction.isCommand() && !interaction.isButton() && !interaction.isStringSelectMenu() && !interaction.isModalSubmit()) return
        const command = client.commands.get(interaction.commandName || interaction.customId)
        if (!command) return
        //console.log(interaction.commandName || interaction.customId, "-->", command.data.description || "Bilinmiyor.")

        // Cooldown_control
        const memberid = interaction.member ? interaction.member.id : interaction.user.id
        const cooldown = cooldown_control(command, memberid)
        if (cooldown) {
            const response = new EmbedBuilder()
                .setDescription(`Bu komutu tekrar kullanmak için \`${cooldown}\` saniye beklemelisiniz.`)
                .setColor("Red")

            interaction.reply({ embeds: [response], ephemeral: true })
            return
        }

        //Ececute Command
        try {
            command.data.execute(interaction)
        } catch (e) {
            interaction.reply({ embeds: [embed(`Bu komutu kullanırken bir hata oluştu.`, "RED")] })
            console.log(e)
        }

    });

}