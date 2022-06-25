const {
    Client,
    Attachment,
    MessageSelectMenu
} = require('discord.js');
const bot = new Client();

const ytdl = require('ytdl-core');//We are declairing ytdl-core in ur program


const token = 'OTg0NDg3MzkyNDYxMzU3MTU3.GIF-Wc.5KkW7fJTQvX4Eoxd5-vIMa31VXKoFjYeQMuZHk';

const PREFIX = '-';

var version = '1.0.0';

var servers = {};//here we store all of ur queue songs;

bot.on('ready' , () => {
    console.log('This bot is online! ' + version);// After execution of this bot will be online 

});

bot.on('message',message => {
    let args = message.content.substring(PREFIX.length).split(" ");//το args σπλιταρεται και γινεται ΠΙΝΑΚΑΣ
    //Το μυνημα ειναι ενα string το οποιο εμεις χωριζουμε σε πινακα string με τη συναρτηση split() μετα στη 
    //switch ελενχουμε αν το πρωτο στοιχειο (ενα string ) του πινακα args ειναι το play.Αν ειναι το δευτερο στοιχειο δεν 
    //υπαρχει τοτε θα πρεπει να του πουμε να βαλει 

    switch (args[0]) {//switch statement 
        case 'play':

        //THIS IS THE MAIN FUNCTIONALITY OF THE BOT START
        function play(connection, message){//Αυτη ειναι η πιο συμαντικη συναρτηση του κωδικα ##############################################
            var server = servers[message.guild.id];

            server.dispatcher = connection.play(ytdl(server.queue[0],{filter: "audioonly"}));//το bot πρεπει να μετατρεψει το video σε audio γιατι αλλιως θα τρεχει πιο αργα 
            
            server.queue.shift();
            server.dispatcher.on("finish",function(){//Μετα απο το discord js v12.0 the event name is finish not end
                if(server.queue[0]){
                    play(connection,message);

                }else{
                    connection.disconnect();
                }
            })//############################################################################
            
        
        }   
            //here is the play case 
            if (!args[1])//check if there is a second argument in array args[]
            {
                message.channel.send('Δεν μου εδωσες τραγουδι');
                return;
            }

            if (!message.member.voice.channel)//checks if user is in a voice channel
            {
                message.channel.send('Δεν εισαι σε καποιο καναλι ηχου');
                return;
            }
            
            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []  //εδω φτιαχνουμε την ουρα τραγουδιων 
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection){
                play(connection, message);//the play fuction
            })

        break;

        case 'skip':///here is the skip case
            var server = servers[message.guild.id];//o server ως μεταβλητη ειναι το λεξικο που περιεχει 
            
            if (server.dispatcher) server.dispatcher.end();
            message.channel.send("Skipping the song")

        
        break;


        case 'stop':
            var server = servers[message.guild.id];
            if(message.guild.voiceConnection){
                for (var i = server.queue.length -1 ; i>= 0 ;i--){
                    server.queue.splice(i,1);
                }

                server.dispatcher.end();
                message.channel.send('Ending the queue ...Leaving the voice channel!')
                console.log('stopped song queue');
            }

            if (message.guild.connection) message.guild.voiceConnection.disconnect();//το bot αποσυνδεεται

        break;
    }
});


bot.login(token)//Always in the end we have the token 



