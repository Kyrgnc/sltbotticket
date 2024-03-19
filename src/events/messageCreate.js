import cooldown_control from "../utils/cooldown_control.js";
import { EmbedBuilder } from "discord.js"

export default client => {
    const channeldestekmsg = process.env.channeldestekmsg
    const prefix = process.env.prefix
    const botid = process.env.botid
    client.on('messageCreate', message => {
        if (message.content.startsWith(prefix) == false) return

        const args = message.content.slice(1).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()

        const command = client.commands.get(commandName)
        if (!command) return

        // Cooldown_control
        const cooldown = cooldown_control(command, message.member.id)
        if (cooldown) {
            const response = new EmbedBuilder()
                .setDescription(`Bu komutu tekrar kullanmak için \`${cooldown}\` saniye beklemelisiniz.`)
                .setColor("Red")

            message.reply({ embeds: [response] })
                .then(async msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, cooldown * 1000 + 1000);

                })
            return
        }

        try {
            const interaction = message
            command.data.execute(interaction)
        } catch (e) {
            console.log(e)
            message.reply(`Bu komutta \`${commandName}\` şu anda hata var!`)
        }
    });

}