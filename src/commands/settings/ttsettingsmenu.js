import Ticket_Schema from "../../utils/database/Ticket_Schema.js";
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"
import fs from 'fs';

export const data = {
    name: "ttsettingsmenu",
    description: "Destek paneli için tüm ayarları gösterir.",
    cooldown: 5,
    async execute(interaction) {
        if (interaction.type === 0) return    
        if (!interaction.isButton()) return
        if(!interaction.member.permissions.has('ADMINISTRATOR')) return


        let buttonName = "Talep Oluştur"
        let msg = `Talep kanalımıza hoş geldiniz.\nHerhangi bir sorununuz varsa, lütfen aşağıdaki **${buttonName}** butonuna basarak ekibimizle iletişime geçin!`
        let buttonColor = "Primary"
        let buttonEmoji = "✉️"
        let categoryconfirm = "Belirlenmedi"
        let channelconfirm = "Belirlenmedi"
        let rolecreated = "Belirlenmedi"
        let roleconfirm = "Belirlenmedi"
        let menutopics = "Belirlenmedi"
        let channellog = "Belirlenmedi"

        const buttonColors = {
            'success': 'Yeşil',
            'primary': 'Mavi',
            'danger': 'Kırmızı',
            'secondary': 'Gri'
        };
        
        const savedGuilds = await Ticket_Schema.findOne({ guild_id: interaction.guild.id });

        if (savedGuilds) {
            if (savedGuilds.buttonName) {
                buttonName = savedGuilds.buttonName;
                msg = `Talep kanalımıza hoş geldiniz.\nHerhangi bir sorununuz varsa, lütfen aşağıdaki **${savedGuilds.buttonName}** butonuna basarak ekibimizle iletişime geçin!`;
            }
    
            if (savedGuilds.msg) msg = savedGuilds.msg;
    
            if (savedGuilds.buttonColor) buttonColor = savedGuilds.buttonColor;
    
            if (savedGuilds.buttonEmoji) buttonEmoji = savedGuilds.buttonEmoji;

            if (savedGuilds.categoryconfirm) categoryconfirm = savedGuilds.categoryconfirm;

            if (savedGuilds.channelconfirm) channelconfirm = savedGuilds.channelconfirm;

            if (savedGuilds.rolecreated){
                if(savedGuilds.rolecreated === "Belirlenmedi") rolecreated = "Tüm Roller";
                else rolecreated = savedGuilds.rolecreated.split(',').map(id => `<@&${id}>`).join(',');
            } 

            if (savedGuilds.roleconfirm) roleconfirm = savedGuilds.roleconfirm.split(',').map(id => `<@&${id}>`).join(',');
            
            if (savedGuilds.menutopics) menutopics = savedGuilds.menutopics.split(',').map(id => id).join(',');
            
            if (savedGuilds.channellog) channellog = savedGuilds.channellog;
        
        }
        
        const readedCategorys = readSettingSM()

        const buttonColorEdit = buttonColors[buttonColor.toLowerCase()] || 'Bilinmeyen Renk';

        const response = new EmbedBuilder()
            .setAuthor({ name: "Destek Paneli Ayarları" })
            .setDescription(`
__**Bildiri Mesajı:**__ ${msg}
__**Buton İsmi:**__ ${buttonName}
__**Buton Rengi:**__ ${buttonColorEdit}

__**Destek Talepleri Onay Kanalı:**__ <#${channelconfirm}>
__**Onaylanan Taleplerin Düşeceği Kategori:**__ <#${categoryconfirm}>

__**Destek talebi oluşturan roller:**__ ${rolecreated}
__**Destek talebine onay/ret veren roller:**__ ${roleconfirm}

__**Destek talebi konuları:**__ ${menutopics}
__**Kapanan Taleplerin Kanalı:**__ <#${channellog}>
`)
            .addFields(
                { name: 'Not:', value: `Destek paneli hakkında tüm ayarları aşağıdaki menü ile yapabilirsiniz.` },
            ) 
            .setColor("Orange")
            .setFooter({ text: '• COPYRİGHT 2024 Ticket Bot', iconURL: interaction.guild.iconURL({ dynamic: true }) });

            const row = new ActionRowBuilder()
            .setComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("settingscustom")
                    .setPlaceholder("Ayarları Düzenle")
                    .addOptions(
                        ...readedCategorys.map(option => new StringSelectMenuOptionBuilder()
                            .setLabel(option.setLabel)
                            .setValue(option.setValue)
                            .setDescription(option.setDescription)
                        )
                    )
            );

        interaction.update({ embeds: [response], components: [row], ephemeral: true }).catch((error) => { error.message });

    }
};


function readSettingSM() {
    const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
    const readedCategorys = [];
    let count = 1;

    settings.categorys.forEach(categoryObject => {
        const category = categoryObject.category;

        if (category) {
            const setLabel = category;
            const setDescription = categoryObject.description || category;
            const setValue = `${count++}`;

            readedCategorys.push({
                setLabel,
                setDescription,
                setValue
            });
        }
    });

    return readedCategorys;
}
