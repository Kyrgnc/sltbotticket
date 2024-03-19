import Ticket_Schema from "../../utils/database/Ticket_Schema.js";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder } from "discord.js"

export const data = {
    name: "settingscustom",
    description: "Destek paneli için ayarlar değişikliği yapar.",
    cooldown: 5,
    async execute(interaction) {
        if (interaction.type === 0) return
        if (!interaction.isStringSelectMenu()) return

        if(!interaction.member.permissions.has('ADMINISTRATOR')) return


        const value = `${interaction.values}`;
        const guildId = interaction.guild.id;

        if (value === "1") {

            const modal = new ModalBuilder()
                .setCustomId("ttsettingsmsgedit")
                .setTitle("Bildiri Mesajı")
                .setComponents(
                    new ActionRowBuilder()
                        .setComponents(
                            new TextInputBuilder()
                                .setCustomId("bildiri")
                                .setLabel("Bildiri Mesajı:")
                                .setMinLength(1)
                                .setMaxLength(1500)
                                .setRequired(true)
                                .setStyle("Paragraph")
                        )
                )
            interaction.showModal(modal)

        }
        else if (value === "2") {

            const modal = new ModalBuilder()
                .setCustomId("ttsettingsbtntextedit")
                .setTitle("Buton İsmi")
                .setComponents(
                    new ActionRowBuilder()
                        .setComponents(
                            new TextInputBuilder()
                                .setCustomId("bildiri")
                                .setLabel("Buton İsmi:")
                                .setMinLength(1)
                                .setMaxLength(75)
                                .setRequired(true)
                                .setStyle("Short")
                        )
                )
            interaction.showModal(modal)

        }
        else if (value === "4") {

            const buttonColors = {
                'success': 'Yeşil',
                'primary': 'Mavi',
                'danger': 'Kırmızı',
                'secondary': 'Gri'
            };

            const response = new EmbedBuilder()
                .setAuthor({ name: "Destek Paneli Ayarları" })
                .setColor("Orange")
                .setDescription("Aşağıdaki menüden seçim yapın")


            const row = new ActionRowBuilder()
                .setComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("settingscoloredit")
                        .setPlaceholder("Renk Seç")
                        .addOptions([
                            {
                                label: 'Mavi',
                                description: 'Buton rengi mavi olur',
                                value: 'Primary',
                            },
                            {
                                label: 'Yeşil',
                                description: 'Buton rengi yeşil olur',
                                value: 'Success',
                            },
                            {
                                label: 'Kırmızı',
                                description: 'Buton rengi kırmızı olur',
                                value: 'Danger',
                            },
                            {
                                label: 'Gri',
                                description: 'Buton rengi gri olur',
                                value: 'Secondary',
                            },
                            {
                                label: 'Mesajı sil',
                                description: 'Mesajı işlem yapmadan siler',
                                value: 'msgdelete',
                            },
                        ])
                );

            interaction.update({ embeds: [response], components: [row] })


            const msg = interaction.message

            const filter = (i) => {
                return i.customId === 'settingscoloredit';
            };

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 90_000 });

            collector.on('collect', async (i) => {
                const selectedValue = `${i.values}`;

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
                            .setStyle("Danger")
                    );

                if (selectedValue === "Primary" || selectedValue === "Success" || selectedValue === "Danger" || selectedValue === "Secondary") {


                    await Ticket_Schema.updateOne({ guild_id: interaction.guild.id }, { $set: { buttonColor: selectedValue } }, { upsert: true })
                        .then(async () => {

                            const buttonColorEdit = buttonColors[selectedValue.toLowerCase()] || 'Bilinmeyen Renk';
                            response
                                .setDescription(`**Buton rengi** başarılı bir şekilde güncellendi.\n\n${buttonColorEdit}`)
                                .setColor("Green")
                            i.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
                        })
                        .catch(async (error) => {
                            response
                                .setDescription(`Hata oluştu.`)
                                .setColor("Red")
                            console.log(error.message);
                            i.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
                        });

                }
                else {
                    i.message.delete().catch((error) => { console.log(error.message); });
                }

                collector.stop();
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    msg.delete().catch((error) => { console.log(error.message); });
                }
            });


            await Ticket_Schema.updateOne({ user_id: guildId }, { $set: {} }, { upsert: true }).catch((error) => { error.message });
        }
        else if (value === "4") {

            const modal = new ModalBuilder()
                .setCustomId("ttsettingsbtnchanneledit")
                .setTitle("Destek Talepleri Onay Kanalı")
                .setComponents(
                    new ActionRowBuilder()
                        .setComponents(
                            new TextInputBuilder()
                                .setCustomId("channelconfirm")
                                .setLabel("Destek Talepleri Onay Kanalı:")
                                .setMinLength(1)
                                .setMaxLength(30)
                                .setRequired(true)
                                .setStyle("Short")
                        )
                )
            interaction.showModal(modal)

        }
        else if (value === "5") {

            const modal = new ModalBuilder()
                .setCustomId("ttsettingsbtncategoryedit")
                .setTitle("Onaylanan Taleplerin Düşeceği Kategori")
                .setComponents(
                    new ActionRowBuilder()
                        .setComponents(
                            new TextInputBuilder()
                                .setCustomId("categoryconfirm")
                                .setLabel("Onaylanan Taleplerin Düşeceği Kategori:")
                                .setMinLength(1)
                                .setMaxLength(30)
                                .setRequired(true)
                                .setStyle("Short")
                        )
                )
            interaction.showModal(modal)

        }
        else if (value === "6") {

            const response = new EmbedBuilder()
                .setAuthor({ name: "Destek Paneli Ayarları" })
                .setColor("Orange")
                .setDescription("Aşağıdaki menüden seçim yapın")

            const row = new ActionRowBuilder()
                .setComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("settingsaroleedit")
                        .setPlaceholder("Seçim Yap")
                        .addOptions([
                            {
                                label: 'Ekle',
                                description: 'Rol ekler',
                                value: 'aroleeditadd',
                            },
                            {
                                label: 'Çıkar',
                                description: 'Rol çıkarır',
                                value: 'aroleeditdel',
                            },
                            {
                                label: 'Tüm Roller',
                                description: 'Tüm rolleri ekler',
                                value: 'aroleeditaddall',
                            },
                            {
                                label: 'Mesajı sil',
                                description: 'Mesajı işlem yapmadan siler',
                                value: 'arolemsgdelete',
                            },
                        ])
                );

            interaction.update({ embeds: [response], components: [row] })


            const msg = interaction.message

            const filter = (i) => {
                return i.customId === 'settingsaroleedit';
            };

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 90_000 });

            collector.on('collect', async (i) => {
                const selectedValue = `${i.values}`;

                if (selectedValue === "aroleeditadd") {
                   
                    const modal = new ModalBuilder()
                        .setCustomId("ttsettingsbtnrolecaddedit")
                        .setTitle("Destek talebi oluşturan roller")
                        .setComponents(
                            new ActionRowBuilder()
                                .setComponents(
                                    new TextInputBuilder()
                                        .setCustomId("ttsettingsbtnrolecadd")
                                        .setLabel("eklenecek rol id'si girin:")
                                        .setMinLength(1)
                                        .setMaxLength(30)
                                        .setRequired(true)
                                        .setStyle("Short")
                                )
                        )

                    i.showModal(modal)

                }
                else if (selectedValue === "aroleeditdel") {

                    const modal = new ModalBuilder()
                        .setCustomId("ttsettingsbtnrolecdeledit")
                        .setTitle("Destek talebi oluşturan roller")
                        .setComponents(
                            new ActionRowBuilder()
                                .setComponents(
                                    new TextInputBuilder()
                                        .setCustomId("ttsettingsbtnrolecdel")
                                        .setLabel("Silinecek rol id'si girin:")
                                        .setMinLength(1)
                                        .setMaxLength(30)
                                        .setRequired(true)
                                        .setStyle("Short")
                                )
                        )
                    i.showModal(modal)

                }
                else if (selectedValue === "aroleeditaddall") {

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('ttsettingsmenu')
                                .setLabel("Geri Gel")
                                .setStyle("Secondary"),
                            new ButtonBuilder()
                                .setCustomId('ttsettingsdeletemsg')
                                .setLabel("Mesajı Sil")
                                .setStyle("Danger")
                    );

                    await Ticket_Schema.updateOne({ guild_id: interaction.guild.id }, { $set: { rolecreated: "Belirlenmedi" } }, { upsert: true })
                        .then(async () => {

                            response
                                .setDescription(`**Destek taleplerinin oluşturacak rol** başarılı bir şekilde tüm roller olarak güncellendi.`)
                                .setColor("Green")
                            i.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
                        })
                        .catch(async (error) => {
                            response
                                .setDescription(`Hata oluştu.`)
                                .setColor("Red")
                            console.log(error.message);
                            i.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
                        });

                }
                else {
                    i.message.delete().catch((error) => { console.log(error.message); });
                }

                collector.stop();
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    msg.delete().catch((error) => { console.log(error.message); });
                }
            });

        }
        else if (value === "7") {

            const response = new EmbedBuilder()
                .setAuthor({ name: "Destek Paneli Ayarları" })
                .setColor("Orange")
                .setDescription("Aşağıdaki menüden seçim yapın")

            const row = new ActionRowBuilder()
                .setComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("settingsbroleedit")
                        .setPlaceholder("Seçim Yap")
                        .addOptions([
                            {
                                label: 'Ekle',
                                description: 'Rol ekler',
                                value: 'broleeditadd',
                            },
                            {
                                label: 'Çıkar',
                                description: 'Rol çıkarır',
                                value: 'broleeditdel',
                            },
                            {
                                label: 'Mesajı sil',
                                description: 'Mesajı işlem yapmadan siler',
                                value: 'brolemsgdelete',
                            },
                        ])
                );

            interaction.update({ embeds: [response], components: [row] })


            const msg = interaction.message

            const filter = (i) => {
                return i.customId === 'settingsbroleedit';
            };

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 90_000 });

            collector.on('collect', async (i) => {
                const selectedValue = `${i.values}`;

                if (selectedValue === "broleeditadd") {
                   
                    const modal = new ModalBuilder()
                        .setCustomId("ttsettingsbtnroleoaddedit")
                        .setTitle("Destek talebine onay/ret veren roller")
                        .setComponents(
                            new ActionRowBuilder()
                                .setComponents(
                                    new TextInputBuilder()
                                        .setCustomId("ttsettingsbtnroleoadd")
                                        .setLabel("eklenecek rol id'si girin:")
                                        .setMinLength(1)
                                        .setMaxLength(30)
                                        .setRequired(true)
                                        .setStyle("Short")
                                )
                        )
                    i.showModal(modal)

                }
                else if (selectedValue === "broleeditdel") {

                    const modal = new ModalBuilder()
                        .setCustomId("ttsettingsbtnroleodeledit")
                        .setTitle("Destek talebine onay/ret veren roller")
                        .setComponents(
                            new ActionRowBuilder()
                                .setComponents(
                                    new TextInputBuilder()
                                        .setCustomId("ttsettingsbtnroleodel")
                                        .setLabel("Silinecek rol id'si girin:")
                                        .setMinLength(1)
                                        .setMaxLength(30)
                                        .setRequired(true)
                                        .setStyle("Short")
                                )
                        )
                    i.showModal(modal)

                }
                else {
                    i.message.delete().catch((error) => { console.log(error.message); });
                }

                collector.stop();
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    msg.delete().catch((error) => { console.log(error.message); });
                }
            });

        }
        else if (value === "8") {

            const response = new EmbedBuilder()
                .setAuthor({ name: "Destek Paneli Ayarları" })
                .setColor("Orange")
                .setDescription("Aşağıdaki menüden seçim yapın")

            const row = new ActionRowBuilder()
                .setComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("settingsmtopicedit")
                        .setPlaceholder("Seçim Yap")
                        .addOptions([
                            {
                                label: 'Ekle',
                                description: 'Konu ekler',
                                value: 'mtopiceditadd',
                            },
                            {
                                label: 'Çıkar',
                                description: 'Konu çıkarır',
                                value: 'mtopiceditdel',
                            },
                            {
                                label: 'Sıfırla',
                                description: 'Konuları sıfırlar',
                                value: 'mtopiceditaddall',
                            },
                            {
                                label: 'Mesajı sil',
                                description: 'Mesajı işlem yapmadan siler',
                                value: 'mtopicmsgdelete',
                            },
                        ])
                );

            interaction.update({ embeds: [response], components: [row] })


            const msg = interaction.message

            const filter = (i) => {
                return i.customId === 'settingsmtopicedit';
            };

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 90_000 });

            collector.on('collect', async (i) => {
                const selectedValue = `${i.values}`;

                if (selectedValue === "mtopiceditadd") {
                   
                    const modal = new ModalBuilder()
                        .setCustomId("ttsettingsbtntopicmaddedit")
                        .setTitle("Destek talebi konuları")
                        .setComponents(
                            new ActionRowBuilder()
                                .setComponents(
                                    new TextInputBuilder()
                                        .setCustomId("ttsettingsbtntopicmadd")
                                        .setLabel("Eklenecek Konu Girin:")
                                        .setMinLength(1)
                                        .setMaxLength(80)
                                        .setRequired(true)
                                        .setStyle("Short")
                                )
                        )

                    i.showModal(modal)

                }
                else if (selectedValue === "mtopiceditdel") {

                    const modal = new ModalBuilder()
                        .setCustomId("ttsettingsbtntopicmdeledit")
                        .setTitle("Destek talebi konuları")
                        .setComponents(
                            new ActionRowBuilder()
                                .setComponents(
                                    new TextInputBuilder()
                                        .setCustomId("ttsettingsbtntopicmdel")
                                        .setLabel("Silinecek Konu Girin:")
                                        .setMinLength(1)
                                        .setMaxLength(30)
                                        .setRequired(true)
                                        .setStyle("Short")
                                )
                        )
                    i.showModal(modal)

                }
                else if (selectedValue === "mtopiceditaddall") {

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('ttsettingsmenu')
                                .setLabel("Geri Gel")
                                .setStyle("Secondary"),
                            new ButtonBuilder()
                                .setCustomId('ttsettingsdeletemsg')
                                .setLabel("Mesajı Sil")
                                .setStyle("Danger")
                    );

                    await Ticket_Schema.updateOne({ guild_id: interaction.guild.id }, { $set: { menutopics: "Talep aç" } }, { upsert: true })
                        .then(async () => {

                            response
                                .setDescription(`**Destek talep konuları** başarılı bir şekilde sıfırlanarak güncellendi.`)
                                .setColor("Green")
                            i.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
                        })
                        .catch(async (error) => {
                            response
                                .setDescription(`Hata oluştu.`)
                                .setColor("Red")
                            console.log(error.message);
                            i.update({ embeds: [response], components: [row] }).catch((error) => { error.message });
                        });

                }
                else {
                    i.message.delete().catch((error) => { console.log(error.message); });
                }

                collector.stop(); 
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    msg.delete().catch((error) => { console.log(error.message); });
                }
            });

        }
        else if (value === "9") {

            const modal = new ModalBuilder()
                .setCustomId("ttsettingsbtnchannellogedit")
                .setTitle("Kapanan Taleplerin Log Kanalı")
                .setComponents(
                    new ActionRowBuilder()
                        .setComponents(
                            new TextInputBuilder()
                                .setCustomId("channellog")
                                .setLabel("Kapanan Taleplerin Log Kanalı:")
                                .setMinLength(1)
                                .setMaxLength(30)
                                .setRequired(true)
                                .setStyle("Short")
                        )
                )
            interaction.showModal(modal)
        }
        else if (value === "10") {
            interaction.message.delete().catch((error) => { console.log(error.message); });

        }

    }
};