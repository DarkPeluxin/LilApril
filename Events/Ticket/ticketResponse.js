const {ChannelType, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, PermissionsBitField} = require("discord.js");
const ticketSchema = require("../../Models/Ticket");
const ticket = require('../../Models/Ticket');
const { ticketParent, everyone } = require("../../config.json");


module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const { guild, member, customId, channel } = interaction;
        const { ViewChannel, SendMessages, ManageChannels, ReadMessageHistory, BanMembers } = PermissionFlagsBits;
        const ticketId = Math.floor(Math.random() * 90000) + 10000;

        if (!interaction.isButton()) return;

        if (!["compra", "error", "donar", "other"].includes(customId)) return;

        if (!guild.members.me.permissions.has(ManageChannels))
            interaction.reply({ content: "No tienes los permisos suficientes.", ephemeral: true});

        try {
            await guild.channels.create({
                name: `${customId}-ticket${ticketId.toString().padStart(6, '0')}`,
                type: ChannelType.GuildText,
                parent: ticketParent,
                permissionOverwrites: [
                    {
                      id: everyone,
                      deny: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    {
                      id: member.id,
                      allow: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    ...guild.members.cache
                      .filter(m => m.permissions.has(BanMembers))
                      .map(m => ({ id: m.id, allow: [ViewChannel, SendMessages, ReadMessageHistory] }))
                  ],
                  
                
            }).then(async (channel) => {
                const newTicketSchema = await ticketSchema.create({
                    GuildID: guild.id,
                    MemberID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false,
                    Type: customId,
                });

                const embed = new EmbedBuilder()
                    //.setTitle(`${guild.name} - Sección: ${customId}`)
                    .setDescription("🤖 Por favor, sé educado, detrás de este chat hay una persona de carne y hueso.\n⛔ Por favor, no taguees a los miembros para que respondan más rápido.\n🕜 Uno o más miembros del Staff intentarán responderte lo antes posible.\n❗ Envía toda la información necesaria para completar el ticket.\n‼️  En el caso de insultar o amenazar, serás expulsado automáticamente.\n⌛ En el caso de no recibir ningún mensaje, se cerrará automáticamente el ticket.")
                    .setFooter({ text: `${ticketId}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();
                
                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('close').setLabel('Cerrar tciket').setStyle(ButtonStyle.Primary).setEmoji('💨'),
                    new ButtonBuilder().setCustomId('lock').setLabel('Bloquear ticket').setStyle(ButtonStyle.Secondary).setEmoji('🔐'),
                    new ButtonBuilder().setCustomId('unlock').setLabel('Desbloquear ticket').setStyle(ButtonStyle.Success).setEmoji('🔒'),
                );

                const {user} = member;
                channel.send({
                    content: `¡Hola ${user}!, te pedimos que detalles tu inquietud.`,
                    embeds: ([embed]),
                    components: [
                        button
                    ]
                });

                interaction.reply({ content: `Puedes encontrar tu ticket aquí: ${channel}`, ephemeral: true });
            });
        } catch (err) {
            return console.log(err);
        }
    }
}