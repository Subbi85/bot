const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'hilfe',
    description: 'Displays help information.',
    execute(message) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle("Hilfe - Übersicht über die Befehle")
            .setDescription("Hier eine Übersicht über die Befehle:")
            .addFields(
                { name:"!history", value:"Lädt die Arbenteuerberichte bisheriger Spieleabende herunter"},
                { name:"!roll AnzahldWürfel [+Modifier]", value: "Würfelt eine beliebige Anzahl von Würfeln. Du kannst deine Modifier ebenfalls einlegen. Hier ein Beispiel: `!roll 4d6 +2`)." },
                { name:"!monster NAME" , value:"Zeigt Informationen zu einem bestimmten Monster an (z.B. Adult Red Dragon) und ein Bild"},
                { name:"!spell NAME", value:"Zeigt Informationen zu einem bestimmten Zauber an"},
                { name:"!item NAME", value:"Zeigt Informationen zu einem bestimmten Item an"},
                { name:"!msearch Red Dragon", value:"Sucht Monster nach Stichworten. hier: 'Red' und 'Dragon'und gibt eine Liste zurück"},
                { name:"!ssearch fire wall", value:"Sucht Zauber nach Stichworten. hier: 'Fire' und 'Wall' und gibt eine Liste zurück"},
                { name:"!poll 'Frage...' 'Antwort A' 'Antwort B' 'Antwort C' ...", value:"Erstellt eine Abstimmung"},
                { name:"!hilfe", value: "Zeigt diese Hilfenachricht an..." }
            )
            .setFooter({ text: "So far... SubbiBot" });

        return message.channel.send({ embeds: [helpEmbed] });
    }
};