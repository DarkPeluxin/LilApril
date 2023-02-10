const { SlashCommandBuilder, Client, PermissionFlagsBits, ChannelType, GuildVoice } = require("discord.js");
const schema = require("../../Models/join-to-create");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-jointocreate")
    .setDescription("Configurar el canal y límite de usuario.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => 
    option.setName("canal")
    .setDescription("Canal que al unirse se cree el temporal.")
    .addChannelTypes(ChannelType.GuildVoice)
    .setRequired(true)
    )
    .addNumberOption(option => 
    option.setName("número")
    .setDescription("Límite de usuarios de todos los canales creados.")
    .setMinValue(1)
    .setMaxValue(99)
    .setRequired(true)
    ),

    async execute(interaction) {
        const { guild, options } = interaction;
        const channel = options.getChannel("canal")
        const userlimit = options.getNumber("número")

        let data = schema.findOne({ Guild: interaction.guild.id })
        if (data) {
            data = new schema({
                Guild: interaction.guild.id,
                Channel: channel.id,
                UserLimit: userlimit
            })

            await data.save()

            interaction.reply({ content: "El sistema de voice temp se realizó con éxito.", ephemeral: true })
        }
    }
}