const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    PermissionsBitField
  } = require("discord.js");
  
module.exports = {
    data: new SlashCommandBuilder()
      .setName("lock")
      .setDescription("Bloquea un canal.")
      .addChannelOption((option) =>
        option.setName("canal").setDescription("Elige un canal.")
        .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
    async execute(interaction, client) {
  
      const succesEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(":lock: Bloqueado!")
        .setDescription(`Canal bloqueado con éxito.`);
  
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false,
        AttachFiles: false,
        ReadMessageHistory: true,
      });
  
      await channel.permissionOverwrites.edit("1063523554844491937",//Poner ID de STAFF
        {
          SendMessages: true,
          AttachFiles: true,
        }
      );
  
      await interaction.reply({
        embeds: [succesEmbed],
      });
    },
};