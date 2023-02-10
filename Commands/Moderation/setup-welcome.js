const {Message, Client, SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");
const welcomeSchema = require("../../Models/Welcome");
const {model, Schema} = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-welcome")
    .setDescription("Configura tu mensaje de bienvenida para el bot de Discord.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName("channel")
        .setDescription("Canal para mensajes de bienvenida.")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("welcome-message")
        .setDescription("Ingrese su mensaje de bienvenida.")
        .setRequired(true)
    )
    .addRoleOption(option =>
        option.setName("welcome-role")
        .setDescription("Introduzca su papel de bienvenida.")
        .setRequired(true)    
    ),

    async execute(interaction) {
        const {channel, options} = interaction;

        const welcomeChannel = options.getChannel("channel");
        const welcomeMessage = options.getString("welcome-message");
        const roleId = options.getRole("welcome-role");

        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({content: "No tengo permisos para esto.", ephemeral: true});
        }

        welcomeSchema.findOne({Guild: interaction.guild.id}, async (err, data) => {
            if(!data) {
                const newWelcome = await welcomeSchema.create({
                    Guild: interaction.guild.id,
                    Channel: welcomeChannel.id,
                    Msg: welcomeMessage,
                    Role: roleId.id
                });
            }
            interaction.reply({content: 'Mensaje de bienvenida creado con éxito', ephemeral: true});
        })
    }
}