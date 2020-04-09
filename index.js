const Discord = require("discord.js");
const fs=require("fs");
const ytdl = require('ytdl-core');
const tokens = require('./token.json');


let prev;
console.log(`




============================================
`)

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


let Bot = function(token){
    let client = new Discord.Client();
    client.login(token).catch(err => {
    console.log(token + ` не смог залогиниться`);
	console.log("удали их из списка бот не будет работать");
  });
    
    let idvoice = "";
    let music_bot = false;

    
    
    client.on("ready", () => {
    
        console.log(`Bot  ${client.user.username} is ready! (${client.guilds.size} servers)`);
        client.user.setActivity('Raid: Shadow Legends', { type: 'PLAYING' });
    });


    this.getClient = () => {return client};
	
        this.joinChannel = function(chnid) {
            idvoice = chnid;
            try {
    let channel = client.channels.get(chnid);
    channel.join()
    console.log(`Bot  ${client.user.username} - Вошёл успешно.`);
        } catch (err) {
        console.log(`Bot  ${client.user.username} - Не смог войти.`);
        }
    }

    
    this.sendChannel = function(chnid, message_content) {
        
            try {
    
    client.channels.get(chnid).send(message_content);
    console.log(`Bot  ${client.user.username} - Отправил успешно.`);
        } catch (err) {
        console.log(`Bot  ${client.user.username} - Не смог отправить.` + err);
        }
    }
    this.joinServer = function(key) {
        try {
        var xhr = new XMLHttpRequest()

            xhr.open("POST", `https://discordapp.com/api/v6/invites/${key}?token=${token}`, true)
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
            xhr.send()
        console.log(`Bot  ${client.user.username} - Вошёл успешно.`);
        } catch (err) {
        console.log(`Bot  ${client.user.username} - Не смог войти. - ${err}`);
        }
    }
    let dispatcher;
    this.audioplay = async function (url_yt) {
    if(music_bot == true){   
    const stream = ytdl(url_yt);
    let channel = client.channels.get(idvoice);
    await channel.join()
    .then(connection => {
                dispatcher = connection.playStream(stream);
    });
    console.log(`Bot  ${client.user.username} - играю музыку.`)
            }
            if(music_bot == false){ console.log(`Bot  ${client.user.username} - Модуль отключен`);}
    }

    this.audioplay_file = async function (file_music) {
    if(music_bot == true){   

    let channel = client.channels.get(idvoice);
    await channel.join()
    .then(connection => {
                dispatcher = connection.playFile(file_music);
    });
    console.log(file_music)
    console.log(`Bot  ${client.user.username} - играю музыку.`)
            }
            if(music_bot == false){ console.log(`Bot  ${client.user.username} - Модуль отключен`);}
    }
    this.audiostop =  function () {
        
        if(dispatcher) dispatcher.end();

    }
    this.setVolume = function(volume) {
		if(music_bot == true){
        if(dispatcher) dispatcher.setVolumeLogarithmic(volume);
		console.log(`Bot  ${client.user.username} - Громкость стоит - ${volume}`)
		}
		 if(music_bot == false){ console.log(`Bot  ${client.user.username} - Модуль отключен`);}
    }
	    this.music_turn = function() {
        if(music_bot == false){ music_bot = true; console.log(`Bot  ${client.user.username} - Модуль музыки включён`); return}
		 if(music_bot == true){ music_bot = false; console.log(`Bot  ${client.user.username} - Модуль музыки выключен`); return}
    }
	    this.music_status = function() {
        if(music_bot == false){  console.log(`Bot  ${client.user.username} - STATUS - Модуль музыки включён`); return}
		 if(music_bot == true){  console.log(`Bot  ${client.user.username} - STATUS - Модуль музыки выключен`); return}
    }

    this.clearServers = function(){
        client.guilds.forEach(async g => {
            setTimeout(async () => {
              try{
                  await g.leave()
                  console.log(`${client.user.tag} > Вышел из ${g.name}`)
                }catch(e){
                  console.log(`${client.user.tag} > Не может выйти из ${g.name} (${e.name})`)
                }
            }, 1000)         
        })
    }

    this.botLeave = function(gid){
        let guild = client.guilds.get(gid.toString());
        if(!guild) return console.log(`${client.user.tag} > нет сервера`);

        guild.leave().then(g => {
            console.log(`${client.user.tag} > вышел`);
        }).catch(e => {
            console.log(`${client.user.tag} > не смог ливнуть`)
        });
    }
}



rl.on('line', (input, args) => {
    let inputs = input.split(' ');
    if(inputs[0] !== '!!') prev = inputs;
    if(inputs[0] == '!!') {
        inputs = prev;
    }
    prev = inputs;
    let chnid;
    let botid;
    let url_yt;
    let gid;
    let message_content;
    switch (inputs[0].toUpperCase()) {
        case "CLEAR_SERVERS":
            bots.forEach((bot) => {
                bot.clearServers();
            })
            break;

        case "JOIN":
        case "JOIN_SERVER":
            let key = inputs[1];
            let delay_join = 1000;
            bots.forEach((bot)=>{
                
                setTimeout(function(){
               bot.joinServer(key);
               }, delay_join);
            });
        break;
        case "MUSIC_TURN+1":
            botid = inputs[1];
            try {
                bots[botid].music_turn();
            } catch(err) {
                console.log("Ошибка");
            }
            break;
        case "VOL":
        case "V":
        case "VOLUME":
            bots.forEach((bot)=>{
                bot.setVolume(inputs[1]);
           });
           break;
        case "MUSIC_STATS":
        case "MSTATS":
            bots.forEach((bot)=>{
                bot.music_status();
           });
           break;

        case "MUSIC_TURN":
            bots.forEach((bot)=>{
                bot.music_turn();
           });
           break;

        case "VC":
        case "VOICE":
            chnid = inputs[1];
            bots.forEach((bot)=>{
               bot.joinChannel(chnid);
               
            });
            break;
        case "VOICE+1":
            chnid = inputs[1];
            botid = inputs[2];
           try {
               bots[botid].joinChannel(chnid);
           } catch(err) {
               console.log("Ошибка");
           }
           break;
        case "PLAY":
            url_yt = inputs[1];
            bots.forEach((bot)=>{
               bot.audioplay(url_yt);
    
            });
            break;
        case "PLAY_FILE":
            url_yt = inputs[1];
            let file_music = "";

            for(let i = 0; i < inputs.length; i++) {
                if(i > 1) {
                    file_music += `${inputs[i]} `;
                }   
            }
            bots.forEach((bot)=>{bot.audioplay_file(file_music);});
            break;
        case "STOP":
            bots.forEach((bot)=>{
                bot.audiostop();
     
             });
            break;

        case "SEND":
             chnid = inputs[1];
             message_content = "";

            for(let i = 0; i < inputs.length; i++) {
                if(i > 1) {
                    message_content += `${inputs[i]} `;
                }
            }
            bots.forEach((bot)=>{bot.sendChannel(chnid, message_content);});
            break;
        case "SEND+1":
             chnid = inputs[1];
            message_content = "";

            for(let i = 1; i < inputs.length; i++) {
                if(i > 2) {
                    message_content += `${inputs[i]} `;
                }
            }
            botid = inputs[2];
            bots[botid].sendChannel(chnid, message_content);


            break;

        case "LEAVE":
            gid = inputs[1];
            bots.forEach((bot)=>{
                bot.botLeave(gid);

             });
            break;
        default:
            console.log("Unknown command...")
            break;
    }
	

		
	});

let bots = [];
tokens.forEach(token=> {
bots.push(new Bot(token));
});




	
	
	
	
	