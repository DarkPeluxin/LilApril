const {ButtonInteraction, EmbedBuilder, PermissionFlagsBits, Embed} = require("discord.js");
const {createTranscript} = require("discord-html-transcripts");
const {transcripts} = require("../../config.json");
const ticketSchema = require("../../Models/Ticket");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const {guild, member, customId, channel} = interaction;
        const {ManageChannels, SendMessages} = PermissionFlagsBits;

        if (!interaction.isButton()) return;

        if(!["close", "lock", "unlock"].includes(customId)) return;

        if(!guild.members.me.permissions.has(ManageChannels))
        return interaction.reply({content: "No tienes los permisos suficientes.", ephemeral: true});

        const embed = new EmbedBuilder().setColor("Aqua");
        
        ticketSchema.findOne({ChannelID: channel.id}, async (err, data) => {
            if (err) throw err;
            if (!data) return;

            const fetchedMember = await guild.members.cache.get(data.MemberID);

            switch (customId) {
                case "close":
                    if (!member.permissions.has(ManageChannels))
                    return interaction.reply({content: "No tienes los permisos suficientes.", ephemeral: true});

                    if (data.Closed == true)
                    return interaction.reply({ content: "Ticket is already getting deleted...", ephemeral: true });

                    const attachment = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${data.Type} - ${data.TicketID}.html`,
                    });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Closed: true });
                    
                    const transcriptEmbed = new EmbedBuilder()
                        .setTitle(`Tipo de ticket: ${data.Type}\nNúmero de Ticket: ${data.TicketID}`)
                        .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();

                    const transcriptProcesss = new EmbedBuilder()
                        .setTitle('Guardando ticket...')
                        .setDescription("El ticket se cerrará en 10 seg, no te olvides anotar el número de ticket.")
                        .setColor("Red")
                        .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();

                    const res = await guild.channels.cache.get(transcripts).send({
                        embeds: [transcriptEmbed],
                        files: [attachment],
                    });

                    channel.send({ embeds: [transcriptProcesss] });

                    setTimeout(function () {
                        //member.send({
                            //embeds: [transcriptEmbed.setDescription(`Accede a tu ticket guardado: ${res.url}`)]})//.catch(() => channel.send('No se puedo enviar ticket al DM.'));
                        channel.delete();
                    }, 10000);

                    break;

                case "lock":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "No tienes los permisos suficientes.", ephemeral: true });

                    if(data.locked == true)
                        return interaction.reply({ content: "El ticket está bloqueado.", ephemeral: true });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: true });
                    embed.setDescription("El ticket fue bloqueado con éxito.");

                    channel.permissionOverwrites.edit(fetchedMember, { SendMessages: false });

                    return interaction.reply({ embeds: [embed] });

                case "unlock":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "No tienes los permisos suficientes.", ephemeral: true });
    
                    if(data.locked == false)
                        return interaction.reply({ content: "El ticket está desbloqueado.", ephemeral: true });
    
                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: false });
                    embed.setDescription("El ticket fue desbloqueado con éxito.");
    
                    channel.permissionOverwrites.edit(fetchedMember, { SendMessages: true });
    
                    return interaction.reply({ embeds: [embed] });
            }
        });
    }
}