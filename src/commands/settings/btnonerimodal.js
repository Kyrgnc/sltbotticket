import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder } from "discord.js"

const channelId = process.env.channelonerionayred;

export const data = {
    name: "btnonerimodal",
    description: "Öneri Butonu.",
    cooldown: 24*60*60,
    async execute(interaction) {

        if(!interaction.member.permissions.has('ADMINISTRATOR')) return

        if (interaction.type === 0) return

        if (!interaction.isModalSubmit()) return

        if (!(interaction.member.roles.cache.some(role => targetRoles.includes(role.id)))) {
            await interaction.deferReply({ ephemeral: true });

            let desiredRoles = ""
            if (targetRoles.length >= 1) {
                const rolesid = targetRoles.map(id => `<@&${id}>`).join(", ");
                desiredRoles = `\n__**Gerekli Rol:**__\n${rolesid}`
            }

            const response = new EmbedBuilder()
                .setDescription(`Bunu yapmak için yeterli role sahip değilsiniz.${desiredRoles}`)
                .setColor("Red");

            await interaction.editReply({ embeds: [response], ephemeral: true });

            return;
        }

        const member = interaction.member;
        const memberUsername = member.user.username
        const memberId = member.user.id
        const readingOneri = interaction.components[0].components[0].value


        await interaction.deferReply({ ephemeral: true });
        

        const response = new EmbedBuilder()
            .setAuthor({ name: "Öneri" })
            .setDescription(`${readingOneri}`)
            .addFields(
                { name: '**Öneri Yapan:**', value: `${member} **([${memberUsername}](https://discord.com/users/${memberId}))**`, inline: true },
            )
            .setColor("Blue")
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('btnonerionay')
                    .setLabel('Onayla')
                    .setStyle('Success'),
                new ButtonBuilder()
                    .setCustomId('btnonerireddet')
                    .setLabel('Reddet')
                    .setStyle('Danger')
            );

        await interaction.editReply({ embeds: [response], ephemeral: true });

        const channel = interaction.client.channels.cache.get(channelId);
        if (channel) {
            channel.send({ embeds: [response], components: [row] }).catch((error) => { error.message });
        } else {
            console.error('Kanal bulunamadi.');
        }

    }
};