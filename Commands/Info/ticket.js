const {Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits} = require("discord.js");
const {openticket} = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Crear sistema de ticket.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const {guild} = interaction;

        const embed = new EmbedBuilder()
            .setDescription("Elige para una asistencia personalizada, recuerda que solo podemos ayudarte con temas sobre nuestro servidor, no tenemos asistencia para cosas externas al servidor.")

        const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId('report').setLabel('Reportar Usuario').setStyle(ButtonStyle.Success).setEmoji('🎫'),
            new ButtonBuilder().setCustomId('bugs').setLabel('Bugs / Errores').setStyle(ButtonStyle.Danger).setEmoji('🐞'),
            new ButtonBuilder().setCustomId('donar').setLabel('Próximamente').setStyle(ButtonStyle.Primary).setEmoji('❤️'),
            new ButtonBuilder().setCustomId('other').setLabel('Otros').setStyle(ButtonStyle.Secondary).setEmoji('💏'),
        );

        await guild.channels.cache.get(openticket).send({
            embeds: ([embed]),
            components: [
                button
            ]
        });
        
        interaction.reply({ content: "El mensaje del ticket ha sido enviado.", ephemeral: true });
    }
}