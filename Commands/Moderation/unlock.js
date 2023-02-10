const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    PermissionsBitField
  } = require("discord.js");
const LockdownSchema = require("../../Models/Lock");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("unlock")
      .setDescription("Desbloquear un canal.")
      .addChannelOption((option) =>
        option.setName("canal").setDescription("Elige el canal.")
        .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
    async execute(interaction, client) {
      const channel = interaction.options.getChannel("canal");
  
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🔓 Desbloqueado!")
        .setDescription(`Canal desbloqueado con éxito.`);
  
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: null,
        AttachFiles: null,
        ReadMessageHistory: true,
      });
  
      await interaction.reply({
        embeds: [embed],
      });
    },
};