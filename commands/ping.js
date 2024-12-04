const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Pong!',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong!'),
    async execute(interactionOrMessage) {
        if (interactionOrMessage.isCommand) {
            await interactionOrMessage.reply('Pong!');
        } else {
            await interactionOrMessage.reply('Pong!');
        }
    },
};
