import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js"
// const targetRoles = process.env.cmdpermonerionayredids.split(',');
const channelId = process.env.channelonerisun;


export const data = {
    name: "btnonerionay",
    description: "Öneri işlemini yapar. (Onay)",
    cooldown: 1,
    async execute(interaction) {
        if (interaction.type === 0) return
        if (!interaction.isButton()) 
        if(!interaction.member.permissions.has('ADMINISTRATOR')) return


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
        const memberUsername = member.user.username || "kullanici";
        const memberId = member.user.id || "id";

        let response = interaction.message.embeds[0]
        
        const channel = interaction.client.channels.cache.get(channelId);
        if (channel) {
            const response = new EmbedBuilder()
            .setAuthor({ name: "Öneri" })
            .setDescription(`${interaction.message.embeds[0].description}`)
            .addFields(
                { name: '**Öneri Yapan:**', value: `${interaction.message.embeds[0].fields[0].value}`, inline: true },
            )
            .setColor("Green")
            .setTimestamp();
            channel.send({ embeds: [response] }).catch((error) => {error.message});
        } else {
            console.error('Kanal bulunamadi.');
        }

        response.fields.push({ name: '**Öneriyi Sunan:**', value: `${member}**([${memberUsername}](https://discord.com/users/${memberId}))** sundu.` },)
        
        response = new EmbedBuilder(response)
        .setColor("Green");
            
        await interaction.update({ embeds: [response], components: [] });

        // const channel = interaction.client.channels.cache.get(channelId);
        // if (channel) {
        //     channel.send({ embeds: [response] }).catch((error) => {error.message});
        // } else {
        //     console.error('Kanal bulunamadi.');
        // }

        await interaction.message.react('✅');
    }
};