const prompts = require('prompts');
const Discord = require("discord.js");
const fs=require("fs");
const ytdl = require('ytdl-core');
const tokens = require('./token.json');
const fetch = require('node-fetch');



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
        console.log(`Bot  ${client.user.username} - Не смог войти. - ${err}`);
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
		fetch(`https://discordapp.com/api/v6/invites/${key}?token=${token}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => {
		if(json.code == 40002){
			console.log(`Bot  ${client.user.username} - Не смог войти.`)
		} else {
			console.log(`Bot  ${client.user.username} - Заебись вошёл.`)
		}
	});
		
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
    this.audiostop =  function () {
        
        if(dispatcher) dispatcher.end();

    }
	this.status_set =  function (status_text) {
	if(!status_text){
	 console.log("хуета нету ничего")
	 return
	 }
     client.user.setActivity(status_text,{type: 'WATCHING'});

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

    this.botReact = async function(cid, mid, react) {
      let channel = client.channels.get(cid);
      if(!cid) return console.log(`${client.user.name} > Нет канала`);
      let message = await channel.fetchMessage(mid);
      await message.react(react).then(async () => console.log(`${client.user.username} > Поставил реакцию`)).catch(e => {console.log(`${client.user.username} > Не могу поставить реакцию (${e})`)})
    }
}

let bots = [];
 
async function bot_s() {
  const response = await prompts([
    {
      type: 'select',
      name: 'text',
      message: 'Выбери действие',
      choices: [
        { title: 'Music off/on', value: 'music' },
    { title: 'Voice join', value: 'voice_join' },
    { title: 'React', value: 'react' },
		{ title: 'Play music [YouTube]', value: 'play_music' },
		{ title: 'Volume music [YouTube]', value: 'music_volume' },
		{ title: 'Stop music [YouTube]', value: 'music_stop' },
        { title: 'Join server', value: 'join_server' },
		{ title: 'Send message', value: 'send_chat' },
		{ title: 'Set status', value: 'set_status' },
        { title: 'Leave server', value: 'leave_server' }
      ],
    }
  ]);
  



switch (response.text) {
  case "music": //модуль музыки
  await  bots.forEach((bot)=>{
                bot.music_turn();
           });
		   bot_s();
    break;
	  case "voice_join": //завалиться в голосовой
	      const voice_id = await prompts([
        {
      type: 'text',
      name: 'voice_id',
      message: `Please write voice id.`
    }
  ]);
         await   bots.forEach((bot)=>{
               bot.joinChannel(voice_id.voice_id);         
            });
			bot_s();
			
    break;	
	  case "play_music": //вьебать мызыку АУФ
	     const youtube_url = await prompts([
        {
      type: 'text',
      name: 'url',
      message: `Please write youtube url.`
    }
  ]);        
       await     bots.forEach((bot)=>{
               bot.audioplay(youtube_url.url);
            });
			bot_s();
    break;
  case "join_server": //завалиться на сервер
   const invite_code = await prompts([
        {
      type: 'text',
      name: 'invite_code',
      message: `Please write invite code.`
    }
  ]);
          await  bots.forEach((bot, i)=>{
                setTimeout(function(){
               bot.joinServer(invite_code.invite_code);
               }, i * 150);
            });
			bot_s();
    break;
  case "leave_server": //сьебать с сервера
    const guild_id = await prompts([
        {
      type: 'text',
      name: 'guild_id',
      message: `Please write guild id.`
    }
  ]);
          await  bots.forEach((bot)=>{
                bot.botLeave(guild_id.guild_id);
             });
			 bot_s();
    break;
      case "music_stop": //остановить вечеринку
              await   bots.forEach((bot)=>{
                      bot.audiostop();
                  });
            bot_s();
                  break;
      case "music_volume": //увеличить/уменьшить бассы
          const music_volume = await prompts([
              {
            type: 'text',
            name: 'music_volume',
            message: `Please write volume.`
          }
        ]);
                await  bots.forEach((bot)=>{
                  bot.setVolume(music_volume.music_volume);
                });
            bot_s();
                break;	
      case "send_chat": //отправка говна в чат
      const text_send = await prompts([
              {
            type: 'text',
            name: 'ch_id',
            message: `Please write channel text id.`
          },
                {
            type: 'text',
            name: 'text',
            message: `Please write text for send.`
          }
        ]);
                await  bots.forEach((bot)=>{bot.sendChannel(text_send.ch_id, text_send.text);});
            bot_s();
                  break; 
      case "set_status":
      const status_text = await prompts([
              {
            type: 'text',
            name: 'govno_html',
            message: `Please write status text .`
          }
        ]);
      await bots.forEach((bot)=>{bot.status_set(status_text.govno_html);});
            bot_s();
      break;			
      case "react":
        const reactions = await prompts([
          {
        type: 'text',
        name: 'ch_id',
        message: `Please write channel text id.`
      },
            {
        type: 'text',
        name: 'mid',
        message: `Please write message id.`
      },
      {
        type: 'text',
        name: 'reaction',
        message: 'Please write reaction to react.'
      }
    ]);
    await bots.forEach(async (bot)=>{ await bot.botReact(reactions['ch_id'], reactions['mid'], reactions['reaction']);});
    bot_s();

}
}
async function bot_add() {
await tokens.forEach(token=> {
bots.push(new Bot(token));
});
bot_s();
}
bot_add()
