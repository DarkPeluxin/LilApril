const {
    SlashCommandBuilder,
    CommandInteraction,
    PermissionFlagsBits,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("piing")
      .setDescription("Poong")
      .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    /**
     *
     * @param {CommandInteraction} interaction
     */
    execute(interaction) {
      interaction.reply({content: "Pong", ephemeral: true});
    },
  };