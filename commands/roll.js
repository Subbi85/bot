const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roll',
    description: 'Rolls dice in the format XdY, where X is the number of dice and Y is the number of sides.',
    async execute(message, args) {
        if (args.length < 1) {
            return message.reply('Please specify the dice to roll, e.g., `!roll 4d20 +3`');
        }

        const dicePattern = /^(\d*)d(\d+)$/;
        const modifierPattern = /^[+-]\d+$/;

        const match = dicePattern.exec(args[0]);

        if (!match) {
            return message.reply('Fehler im Format. Nutze `XdY` X = Anzahl der Würfel,  Y = Anzahl der Seiten, z.B. `4d20`.');
        }

        const numberOfDice = parseInt(match[1], 10) || 1;
        const sides = parseInt(match[2], 10);

        if (numberOfDice < 1 || sides < 2) {
            return message.reply('Der Würfel muss mindestens 2 Seiten haben.');
        }

        let modifier = 0;
        if (args[1] && modifierPattern.test(args[1])) {
            modifier = parseInt(args[1], 10);
        }

        let rolls = [];
        let total = 0;

        for (let i = 0; i < numberOfDice; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }

        const result = rolls.join(', ');
        const finalTotal = total + modifier;

        const rollEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Würfelergebnis')
            .setDescription(`${message.author.username}, dein Ergebnis: [${result}] mit ${args[0]}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''} (Total: ${finalTotal})`);

        return message.channel.send({ embeds: [rollEmbed] });
    },
};
