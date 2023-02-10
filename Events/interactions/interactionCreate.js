const { CommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        interaction.reply({ content: "Comando Obsoleto." });
      }
      
      command.execute(interaction, client);
    } else if (interaction.isButton()) {
      const { customId } = interaction;

      if(customId == "verify") {
        const role = interaction.guild.roles.cache.get("1025367720335790090");
        return interaction.member.roles.add(role).then((member) =>
          interaction.reply({
            content: `${role} te ha sido asignado.`,
            ephemeral: true,
          })
        );
      }  
    } else {
      return;
    }
  },
};