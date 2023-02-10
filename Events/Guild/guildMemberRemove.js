const { EmbedBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");


module.exports = {
  name: "guildMemberRemove",
  /**
   * @param {GuildMember} member
   */
  execute(member) {
    const {user, guild} = member;
    const memberLogs = member.guild.channels.cache.get('1018929522088873994');
    const leaveMessage = `<@${member.id}> se fue, pero no por siempre.`;
    
    const leaveEmbed = new EmbedBuilder()
            .setDescription(leaveMessage)
            .setAuthor({name:`${user.tag}`, iconURL: `${user.avatarURL({dynamic: true, size: 512})}`})
            .setColor(0x4ea3f7)
            .setFooter({text: `ID: ${user.id}`})
            .addFields({name: 'Miembros:', value: `${guild.memberCount}`})
            .setThumbnail('https://cdn.discordapp.com/icons/997894150261321829/26b189477d51b700fa5e995413e53beb.webp')

    memberLogs.send({embeds: [leaveEmbed]});
    console.log(`${member.id} left the guild.`)
  },
};