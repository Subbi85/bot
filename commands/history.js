const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const HISTORY_FOLDER = path.join(__dirname, '..', '/history');

module.exports = {
    name: 'history',
    description: 'Provides session reports or history files.',
    async execute(message) {
        fs.readdir(HISTORY_FOLDER, (err, files) => {
            if (err) {
                console.error(err);
                return message.reply('There was an error trying to read the history files.');
            }

            const docFiles = files.filter(file => file.endsWith('.pdf'));

            if (docFiles.length === 0) {
                return message.reply('Keine Ergebnisse gefunden');
            }

            const historyEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('History')
                .setDescription('Sessionberichte werden heruntergeladen')
                .setFooter({ text: 'So far ... SubbiBot' });

            message.channel.send({ embeds: [historyEmbed] })
                .then(() => {
                    docFiles.forEach(file => {
                        const filePath = path.join(HISTORY_FOLDER, file);
                        message.channel.send({ files: [filePath] });
                    });
                })
                .catch(error => {
                    console.error(error);
                    message.reply('There was an error trying to send the history files.');
                });
        });
    },
};
