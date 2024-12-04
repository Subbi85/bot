require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const PREFIX = '!';
const TARGET_CHANNELS = [
    process.env.CHANNEL_ID_1,
    process.env.CHANNEL_ID_2
];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

// Load command files dynamically
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
}

// Bot ready event
client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag} on ${client.guilds.cache.size} servers.`);
    client.user.setActivity({ name: 'rolling dice', type: 'PLAYING' });

    const targetChannelId = process.env.CHANNEL_ID_1;
    const channel = client.channels.cache.get(targetChannelId);

    if (channel) {
        channel.send('Here we are now! Entertain us!');
    } else {
        console.error('Ich schlafe weiter.');
    }
});

// Handle slash commands, buttons, and other interactions
client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        if (!TARGET_CHANNELS.includes(interaction.channelId)) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    } else if (interaction.isButton()) {
        const embed = interaction.message.embeds[0];
        if (embed && embed.title === 'New Poll') {
            const optionIndex = parseInt(interaction.customId.split('_')[2], 10);
            await interaction.reply({ content: `You chose option ${optionIndex + 1}!`, ephemeral: true });
        }
    }
});

// Message-based commands (Prefix commands)
client.on('messageCreate', async message => {
    if (!TARGET_CHANNELS.includes(message.channel.id)) return;
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const argsString = message.content.slice(PREFIX.length).trim();
    const args = argsString.match(/(?:[^\s"]+|"[^"]*")+/g)?.map(arg => arg.replace(/^"(.*)"$/, '$1')) || [];
    const commandName = args.shift()?.toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.');
    }
});

const handleShutdown = async () => {
    console.log('Bot is shutting down...');

    const targetChannelId = process.env.BOT_AREA_CHANNEL;
    const channel = client.channels.cache.get(targetChannelId);

    if (channel) {
        await channel.send('Bot is shutting down. Goodbye!');
    } else {
        console.error('Target channel not found for shutdown message.');
    }

    client.destroy();
    process.exit(0);
};

process.on('SIGINT', handleShutdown); 
process.on('SIGTERM', handleShutdown);

client.login(process.env.DISCORD_BOT_TOKEN);
