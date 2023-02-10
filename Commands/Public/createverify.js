const {EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('createverify')
    .setDescription('Configura tu canal de verificación')
    .addChannelOption(option =>
        option.setName('channel')
        .setDescription('Envía verificación embed en este canal')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const verifyEmbed = new EmbedBuilder()
        .setTitle("Verificación")
        .setDescription('Haga click al botón y obtén acceso a los canales de compra.')
        .setColor(0x5fb041)
        let sendChannel = channel.send({
            embeds: ([verifyEmbed]),
            components: [
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('verify').setLabel('Verificar').setStyle(ButtonStyle.Success),
                ),
            ],
        });
        if (!sendChannel) {
            return interaction.reply({content: 'Ocurrió un error, inténtalo más tarde.', ephemeral: true});
        } else {
            return interaction.reply({content: 'El canal de verificación se configuró correctamente!', ephemeral: true});
        }
    },
};