require('dotenv').config()
const {Client, GatewayIntentBits, Partials, Collection, PermissionsBitField} = require('discord.js');
const {Guilds, GuildMembers, GuildMessages} = GatewayIntentBits;
const {User, Message, GuildMember, ThreadMember, Channel} = Partials;
const mongodb = require('mongodb');

const {loadEvents} = require('./Handlers/eventHandler');
const {loadCommands} = require('./Handlers/commandHandler');

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
});

client.once('ready', () => {
    console.log('Listo!');
    client.user.setPresence({
        activities: [{
            details: '24H de Stream por Caridad',
            url:"https://www.twitch.tv/DarkPeluxin",
            state: 'Minecraft',
            name: 'PREPALAND RP | Minecraft',
            type: 1,
        }]
    });
});

client.commands = new Collection();
client.config = require('./config.json');

module.exports = client;

client.login(process.env.TOKEN_DISCORD).then(() => {
    loadEvents(client);
    loadCommands(client);
});

const prefix = `!`;

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  const messageArray = message.content.split(" ");
  const argument = messageArray.slice(1);
  const cmd = messageArray[0];

  //Comando para envíar DM con el bot.
  if (command === `dm`) {
    const allowedRoles = ["Mod", "Manager"];  

    if (!message.member.roles.cache.some(role => allowedRoles.includes(role.name)))
        return message.channel.send("No eres parte del cuerpo administrativo.");

    const member = message.mentions.members.first() || message.guild.members.cache.get(argument[0]) || message.guild.members.cache.find( x => x.user.username.toLowerCase() === argument.slice(0).join(" " || x.user.username === argument[0]));

    if (!member) return message.channel.send("No se pudo encontrar un miembro con ese argumento.");

    const m = args.slice(1).join(" ");
    if (!m) return message.channel.send("Por favor, proporciona un mensaje para enviar.");

    member.send(`**FreePelu** | *Tu tienda favorita por Discord.*\n**${message.author.username}** te dejó un mensaje al finalizar tu ticket __*${message.channel.name}*__.\n**Mensaje**:\n> ${m}`).catch(err => {
      return message.channel.send("No puedo enviar dm a este miembro porque tiene sus dms desactivados");
    })

    message.channel.send(`El STAFF** ${message.author}** realizó el siguiente mensaje.\n**Mensaje**:\n> ${m}`)
    message.delete();
  };

  if (command === "addrole") {

    if (!message.member.permissions.has('KickMembers')) return message.reply("Care' Poto");
    const roleName = args.slice(1).join(" ");
    const member = message.mentions.members.first();
    
    if (!member) return message.reply("Por favor menciona a un miembro válido.");
    if (!roleName) return message.reply("Por favor menciona un rol válido.");
    
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id == args[1])
    
    if (!role) return message.reply("No se pudo encontrar el rol especificado.");
    if (role.position >= message.member.roles.highest.position) return message.reply("No puedes agregar un rol con un rango igual o superior al tuyo.");

    member.roles.add(role)
      .then(() => message.channel.send(`El rol ${roleName} ha sido agregado a ${member.user.tag}.`))
      .catch(error => message.reply(`Lo siento, no pude agregar el rol debido a: ${error}`));
      message.delete();
  };

  //Este comando remueve el rol.  
  if (command === "removerole") {
    if (!message.member.permissions.has('KickMembers')) return message.reply("Poto.");
    const roleName = args.slice(1).join(" ");
    const member = message.mentions.members.first();
    
    if (!member) return message.reply("Por favor menciona a un miembro válido.");
    if (!roleName) return message.reply("Por favor menciona un rol válido.");
    
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id == args[1])
    
    if (!role) return message.reply("No se pudo encontrar el rol especificado.");
    if (role.position >= message.member.roles.highest.position) return message.reply("No puedes agregar un rol con un rango igual o superior al tuyo.");

    member.roles.remove(role)
      .then(() => message.channel.send(`El rol ${roleName} ha sido eliminado de ${member.user.tag}.`))
      .catch(error => message.reply(`Lo siento, no pude eliminar el rol debido a: ${error}`));
      message.delete();
  };

  //Comando para sacar de los canales de texto.
  if (command === "remove") {
    if (!message.member.permissions.has('KickMembers')) return message.reply("Poto.");
    const target = args[1];
    if (!target) return message.reply("Por favor especifica si quieres quitar permisos a un usuario o a un rol.");

    const channel = message.channel;
    if (!channel) return message.reply("No se pudo encontrar el canal de texto actual.");

    if (target === "user" || target === "usuario") {
        const member = message.mentions.members.first();
        if (!member) return message.reply("Por favor menciona a un miembro válido.");

        channel.permissionOverwrites.edit(member, {
            ViewChannel: false
        })
          .then(() => message.channel.send(`El usuario ${member.user.tag} ha sido removido.`))
          .catch(error => message.reply(`Lo siento, no pude quitar los permisos debido a: ${error}`))};

    if (target === "role" || target === "rol") {
        const roleName = args.slice(1).join(" ");
        if (!roleName) return message.reply("Por favor menciona un rol válido.");

        const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id == args[1])
        if (!role) return message.reply("No se pudo encontrar el rol especificado.");

        channel.permissionOverwrites.edit(role, {
            ViewChannel: false
        })
          .then(() => message.channel.send(`El rol ha sido removido del canal ${channel.name}.`))
          .catch(error => message.reply(`Lo siento, no pude quitar los permisos debido a: ${error}`))};
          message.delete();
  };

  // Comando para añadir permisos.
  if (command === "add") {

    if (!message.member.permissions.has('KickMembers')) return message.reply("Poto.");
    const target = args[1];
    if (!target) return message.reply("Por favor especifica si quieres quitar permisos a un usuario o a un rol.");

    const channel = message.channel;
    if (!channel) return message.reply("No se pudo encontrar el canal de texto actual.");

    if (target === "user" || target === "usuario") {
        const member = message.mentions.members.first();
        if (!member) return message.reply("Por favor menciona a un miembro válido.");

        channel.permissionOverwrites.edit(member, {
            ViewChannel: true,
            ReadMessageHistory: true,
            SendMessages: true
        })
          .then(() => message.channel.send(`El usuario ${member.user.tag} ha sido agregado.`))
          .catch(error => message.reply(`Lo siento, no pude quitar los permisos debido a: ${error}`))};

    if (target === "role" || target === "rol") {
        const roleName = args.slice(1).join(" ");
        if (!roleName) return message.reply("Por favor menciona un rol válido.");

        const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id == args[1])
        if (!role) return message.reply("No se pudo encontrar el rol especificado.");

        channel.permissionOverwrites.edit(role, {
            ViewChannel: true,
            ReadMessageHistory: true,
            SendMessages: true
        })
          .then(() => message.channel.send(`El rol ha sido ha sido agregado.`))
          .catch(error => message.reply(`Lo siento, no pude quitar los permisos debido a: ${error}`))};
          message.delete();
  };

  // Comando de MUTE.
  if (command === "mute") {

    if (!message.member.permissions.has('KickMembers')) return message.reply("Poto.");
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(" ");

    if (!member) return message.reply("Por favor menciona a un miembro válido.");
    if (!reason) return message.reply("Por favor incluya una razón para remover los permisos.");

    message.channel.permissionOverwrites.edit(member, {
      SendMessages: false
    })
    .then(() => message.channel.send(`🤫${message.author} restringió ha ${member.user.tag}.\n> _Razón:_  ${reason}`))
    .catch(error => message.reply(`Lo siento, no pude restringir los permisos debido a: ${error}`)
    );
    message.delete();
  };

  // Comnado para desmutear
  if (command === "unmute") {

    if (!message.member.permissions.has('KickMembers')) return message.reply("Poto.");
    const member = message.mentions.members.first();

    if (!member) return message.reply("Por favor menciona a un miembro válido.");

    message.channel.permissionOverwrites.edit(member, {
      SendMessages: null
    })
    .then(() => message.channel.send(`😲 ${member.user.tag} se le removió la restricción.`))
    .catch(error => message.reply(`Lo siento, no pude restringir los permisos debido a: ${error}`)
    );
    message.delete();
  };

  if (command === 'ip') {

    const serverIP = '18.229.62.101';
    message.channel.send(`¡Hola! Puedes ingresar al servidor con esta IP : **${serverIP}**.\n¡Únete y disfruta de nuestro servidor. 💕`);
    message.delete();
  }

  if (command === 'mods') {

    const mods = 'https://cdn.discordapp.com/attachments/1073767043674951780/1074575835220160532/mods_1.19.3.rar';
    message.channel.send(`¡Hola! Los mods que usamos en el servidor son estos : ${mods}.\nTambién puedes encontrar más información aquí: <#1074491454963056690>`);
    message.delete();
  }

  if (command === "edit") {
    if (message.author.id !== message.guild.ownerId) {
        return message.reply("No eres el Owner.");
    }

    const messageID = args[0];
    const newMessage = args.slice(1).join(" ");

    let targetMessage;
    try {
      targetMessage = await message.channel.messages.fetch(messageID);
    } catch (error) {
      return message.reply("No se pudo encontrar el mensaje con ese ID.");
    }
    
    try {
      await targetMessage.edit(newMessage);
    } catch (error) {
      return message.reply("No se pudo editar el mensaje.");
    }
    message.delete();
    return;
}

if (command === 'cerrar') {
  const categoryID = "1074628743659798629";

  if (message.channel.parent.id !== "785019536826040381") {
    return;
  }

  let targetCategory;
  try {
      targetCategory = message.guild.channels.cache.get(categoryID);
  } catch (error) {
      return message.reply("No se pudo encontrar la categoría con ese ID.");
  }

  try {
      await message.channel.setParent(targetCategory.id);
  } catch (error) {
      return message.reply("No se pudo mover el canal.");
  }

  return;
}

if (command === "text") {
  const text = args.join(" ");
  message.channel.send(text);
  message.delete();
}

});


// let giftCards = [
//   '377754800759000', '377754800759018', '377754800759026',
//   '377754800759034', '377754800759042', '377754800759059',
//   '377754800759067', '377754800759075', '377754800759083',
//   '377754800759091', '377754800759109', '377754800759117',
//   '377754800759125', '377754800759133', '377754800759141',
//   '377754800759158', '377754800759166', '377754800759174',
//   '377754800759182', '377754800759190', '377754800759208',
//   '377754800759216', '377754800759224', '377754800759232',
//   '377754800759240', '377754800759257', '377754800759265',
//   '377754800759273', '377754800759281', '377754800759299',
//   '377754800759307', '377754800759315', '377754800759323',
//   '377754800759331', '377754800759349', '377754800759356',
//   '377754800759364', '377754800759372', '377754800759380',
//   '377754800759398', '377754800759406', '377754800759414',
//   '377754800759422', '377754800759430', '377754800759448',
//   '377754800759455', '377754800759463', '377754800759471',
//   '377754800759489'];
//   let cardsSent = 0;
  
//   client.on('messageCreate', message => {
//   if (message.content === '!tc') {
//   if (giftCards.length > 0) {
//   message.channel.send(giftCards[cardsSent]);
//   cardsSent++;
//   if (cardsSent === giftCards.length) {
//   giftCards = [];
//   cardsSent = 0;
//   }
//   message.delete();
//   } else {
//   message.channel.send('No hay más giftcard disponible.');
//   }
//   }
//   });

//Comando para autoreaccionar.
client.on('messageCreate', msg => {
//  if (msg.author.id === client.user.id) return;
//  if (msg.author.bot) return;
  if (msg.content.startsWith("!")) return;
  if (msg.channel.name !== 'working' && msg.channel.name !== 'working-pelu' && msg.channel.name !== '💡﹞sugerencias') return;

  msg.react('✅').then(() => msg.react('🧻'));
});

// let giftCard = [];
// let cardSent = 0;

// function isLuhnValid(num) {
//     let sum = 0;
//     let alt = false;
//     let i = num.length - 1;
//     while (i >= 0) {
//         let n = parseInt(num.charAt(i));
//         if (alt) {
//             n *= 2;
//             if (n > 9) {
//                 n = (n % 10) + 1;
//             }
//         }
//         sum += n;
//         alt = !alt;
//         i--;
//     }
//     return (sum % 10 == 0);
// }

// function generateNextNumbers(num, count) {
//     let result = [];
//     for (let i = 0; i < count; i++) {
//         num++;
//         if (isLuhnValid(num.toString())) {
//             result.push(num);
//         }
//     }
//     return result;
// }

// client.on('messageCreate', message => {
//   if (message.content.startsWith('!gen')) {
//     let input = message.content.split(" ");
//     if (input.length === 2) {
//       let startingNum = input[1];
//       giftCard = generateNextNumbers(startingNum, 50);
//       message.channel.send(`CC Gen: ${giftCard}`);
//     } else if (giftCard.length > 0) {
//       message.channel.send(giftCard[cardSent]);
//       cardSent++;
//       if (cardSent === giftCard.length) {
//         giftCard = [];
//         cardSent = 0;
//       }
//     } else {
//       message.channel.send('Dame un número para empezar.');
//     }
//   }
// });