import Ticket_Schema from "../../utils/database/Ticket_Schema.js";
import { ActionRowBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder } from "discord.js"

export const data = {
  name: "createticket",
  description: "Kullanıcıya kategorileri gösterir",
  cooldown: 10,
  async execute(interaction) {
    if (interaction.type === 0) return
    if (!interaction.isButton()) return

    const savedGuilds = await Ticket_Schema.findOne({ guild_id: interaction.guild.id });
    let rolecntrl = false
    if (savedGuilds && savedGuilds.rolecreated && savedGuilds.rolecreated !== "Belirlenmedi") {
      const targetRoles = savedGuilds.rolecreated.split(',').map(id => id).join(',');
      rolecntrl = !(interaction.member.roles.cache.some(role => targetRoles.includes(role.id)))
    }
  

  if (rolecntrl){      
    await interaction.reply({ content: "Bunu yapmak için yeterli role sahip değilsiniz.", ephemeral: true });
    return;
  }

    let menutopics = "Belirlenmedi"

    if (savedGuilds && savedGuilds.menutopics) menutopics = savedGuilds.menutopics.split(',').map(id => id).join(',');

    const menuString = menutopics;
    const readedCategorys = convertToMenuObjects(menuString)
    const row = new ActionRowBuilder()
      .setComponents(
        new StringSelectMenuBuilder()
          .setCustomId("createticketplus")
          .setPlaceholder("Seçim Yap")
          .addOptions(
            ...readedCategorys.map(option => new StringSelectMenuOptionBuilder()
              .setLabel(option.setLabel)
              .setValue(option.setValue)
              .setDescription(option.setDescription)
            )
          )
      );

    const msg = interaction.reply({ components: [row], ephemeral: true }).catch((error) => { error.message });
    let filteri = false

    const filter = (i) => {
      return i.customId === 'createticketplus';
    };

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 90_000 });

    collector.on('collect', async (i) => {
      const selectedValue = `${i.values}`;

      if (selectedValue) {

        const modal = new ModalBuilder()
          .setCustomId("createticketmodal")
          .setTitle("Destek Paneli")
          .setComponents(
            new ActionRowBuilder()
              .setComponents(
                new TextInputBuilder()
                  .setCustomId("videourl_resim")
                  .setLabel("Video Url-Resim Url:")
                  .setMinLength(1)
                  .setMaxLength(150)
                  .setRequired(true)
                  .setStyle("Short")
              ),
            new ActionRowBuilder()
              .setComponents(
                new TextInputBuilder()
                  .setCustomId("karakterismi")
                  .setLabel("Karakter İsmi:")
                  .setMinLength(1)
                  .setMaxLength(150)
                  .setRequired(true)
                  .setStyle("Short")
              ),
            new ActionRowBuilder()
              .setComponents(
                new TextInputBuilder()
                  .setCustomId(selectedValue)
                  .setLabel("Talebinizi Giriniz:")
                  .setMinLength(50)
                  .setMaxLength(800)
                  .setRequired(true)
                  .setStyle("Paragraph")
              )
          )

        i.showModal(modal)

      }

      collector.stop();

    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        msg.update({ content: "Zaman Geçti", components: [] }).catch((error) => { console.log(error.message) });
        return;
      }
    });

  }
};

function convertToMenuObjects(menuString) {
  if (!menuString || menuString.trim() === '') {
    return [
      {
        setLabel: 'Talep aç',
        setDescription: 'Talep aç',
        setValue: '1'
      }
    ];
  }

  const menuNames = menuString.split(',');

  const menuObjects = menuNames.map((name, index) => {
    return {
      setLabel: name.trim(),
      setDescription: name.trim(),
      setValue: (index + 1).toString()
    };
  });

  return menuObjects;
}