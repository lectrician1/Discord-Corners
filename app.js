const Discord = require('discord.js');
const client = new Discord.Client();
const { Client } = require('pg');
const pg = new Client();
const Heroku = require('heroku-client');
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });
const http = require("http");
const port = process.env.PORT;

// Server keeps the bot with Uptime Robot pinging it
const requestHandler = (request, response) => {
  console.log(request.url);
  response.end('Hello, I am Discord Corners!');
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var msgSplit = msg.content.match(/\([^()]*\)|[^.]+(?=\([^()]*\))|[^.]+/g);
  if (msgSplit[0] === 'request') {
    if (msgSplit[1] === 'partner') {
      if (msgSplit[2].startsWith('(') & msgSplit[2].endsWith(')')) {
        var msgSplit_1 = msgSplit[2]
        msgSplit_1.slice(1,-1);
        var msgSplit2 = msgSplit_1.split(', ');
        var msgSplit3 = [];
        for (i = 0; i < msgSplit2.length; i++) {
          var temp = msgSplit2[i].split(': ');
          msgSplit3.push(temp[0], temp[1]);
        }
        if (msgSplit3[0] === '(invite') {
          if (msgSplit3[1].includes('discord.gg/')) {
            if (msgSplit3[2] === 'desc') {
              msg.author.createDM()
                .then(DMchannel => {
                  var formated = `Invite: ${msgSplit3[1]} \n Description: ${msgSplit3[3]}`
                  DMchannel.send(formated);
                  const filter = m => m.content === 'approve' | m.content === 'disapprove';
                  DMchannel.awaitMessages(filter, { max: 1, time: 20000, errors: ['time'] })
                    .then(collected => {
                      if (collected.values().next().value == "approve") {
                        DMchannel.send('yaya');
                      }
                      else if (collected.values().next().value == "diapprove") {
                        DMchannel.send('nono');
                      }
                    })
                    .catch(collected => console.log('lectrician1 never responded'));
                });
            } 
          }
          else {
            msg.reply('That is not a valid invite!');
          }
        }
        else {
          msg.reply('That is not a valid parameter. \`invite\` should be the first parameter.');
        }
      }
    }
  }
});

client.login(process.env.token);
