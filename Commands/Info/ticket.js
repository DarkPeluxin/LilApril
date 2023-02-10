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
            .setDescription("Elige para una asistencia personalizada, recuerda que solo podemos ayudarte con temas sobre nuestra tienda, no tenemos asistencia para cosas externas a la tienda.")

        const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId('compra').setLabel('Realizar Compra').setStyle(ButtonStyle.Success).setEmoji('🛒'),
            new ButtonBuilder().setCustomId('error').setLabel('Problemas GiftCard').setStyle(ButtonStyle.Danger).setEmoji('🃏'),
            new ButtonBuilder().setCustomId('donar').setLabel('Donaciones').setStyle(ButtonStyle.Primary).setEmoji('❤️'),
            new ButtonBuilder().setCustomId('other').setLabel('Otros').setStyle(ButtonStyle.Secondary).setEmoji('♻️'),
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