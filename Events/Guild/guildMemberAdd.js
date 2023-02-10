const {EmbedBuilder} = require("@discordjs/builders");
const {GuildMember, Embed, InteractionCollector} = require("discord.js");
const Schema = require("../../Models/Welcome");

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        Schema.findOne({Guild: member.guild.id}, async (err, data) => {
            if (!data) return;
            let channel = data.Channel;
            let Msg = data.Msg || ` `;
            let Role = data.Role;

            const {user, guild} = member;
            const welcomeChannel = member.guild.channels.cache.get(data.Channel);
            const welcomeEmbed = new EmbedBuilder()
            .setDescription(data.Msg)
            .setAuthor({name:`${user.tag}`, iconURL: `${user.avatarURL({dynamic: true, size: 512})}`})
            .setColor(0x4ea3f7)
            .setFooter({text: `ID: ${user.id}`})
            .addFields({name: 'Miembros:', value: `${guild.memberCount}`})
            .setThumbnail('https://cdn.discordapp.com/icons/997894150261321829/26b189477d51b700fa5e995413e53beb.webp')


            welcomeChannel.send({embeds: [welcomeEmbed]});
            member.roles.add(data.Role);
        })
    }
}