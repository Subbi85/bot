const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'poll',
    description: 'Erstellt eine Abstimmung',
    async execute(message, args) {
        if (args.length < 3) { 
            return message.reply('Eine Frage mit mindestens 2 Antworten');
        }

        //Formatiert Fragen und Antworten
        const question = args[0];
        const options = args.slice(1);

        //Wenn es zu viele Antwortmöglichkeiten gibt
        if (options.length > 10) {
            return message.reply('You can only provide up to 10 options.');
        }

        //Trackt diejenigen, die schon geantwortet haben
        const votes = new Array(options.length).fill(0);
        const voters = new Set();

        const pollEmbed = new EmbedBuilder()
            .setTitle(question)
            .setDescription(options.map((option, index) => `${index + 1}: ${option} - **0** Stimme(n)`).join('\n'))
            .setColor(0x00AE86)
            .setTimestamp();

        const buttons = options.map((option, index) =>
            new ButtonBuilder()
                .setCustomId(`poll_option_${index + 1}`)
                .setLabel(`${index + 1}`)
                .setStyle(ButtonStyle.Primary)
        );

        const row = new ActionRowBuilder().addComponents(buttons);
        const pollMessage = await message.channel.send({ embeds: [pollEmbed], components: [row] });

        const filter = i => i.customId.startsWith('poll_option_') && i.message.id === pollMessage.id;
        //Hier Timer hinterlegen...
        const collector = pollMessage.createMessageComponentCollector({ filter, time: 600000 });

        collector.on('collect', async i => {
            try {
                if (voters.has(i.user.id)) {
                    return i.reply({ content:'Du hast schon abgestimmt!', ephemeral: true });
                }

                voters.add(i.user.id);
                const optionIndex = parseInt(i.customId.split('_').pop()) - 1;
                votes[optionIndex] += 1;

                const results = options.map((option, index) => `${index + 1}: ${option} - **${votes[index]}** Stimme(n)`).join('\n');
                pollEmbed.setDescription(results);
                await pollMessage.edit({ embeds: [pollEmbed] });

                await i.deferUpdate();

                console.log(`Collected vote for option ${optionIndex + 1} from ${i.user.tag}`);
            } catch (error) {
                console.error('Error collecting vote: ', error);
            }
        });

        collector.on('end', async collected => {
            pollEmbed.setTitle(`${question} - Abstimmung geschlossen`);
            pollEmbed.setColor(0xFF0000);
            await pollMessage.edit({ embeds: [pollEmbed], components: [] });

            const finalResults = options.map((option, index) => `${index + 1}: ${option} - **${votes[index]}** Stimmen(n)`).join('\n');
            await message.channel.send(`Die Abstimmung ist beendet. Das amtliche Endergebnis lautet:\n\n${finalResults}`);
        });
    },
};
