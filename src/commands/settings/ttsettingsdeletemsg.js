export const data = {
    name: "ttsettingsdeletemsg",
    description: "Mesajı siler.",
    cooldown: 5,
    async execute(interaction) {
        if (interaction.type === 0) return
        if (!interaction.isButton()) return
        if(!interaction.member.permissions.has('ADMINISTRATOR')) return


        interaction.message.delete().catch((error) => { console.log(error.message); });


    }
};