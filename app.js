const Discord = require('discord.js');
const client = new Discord.Client();
const { Client } = require('pg');
const pg = new Client();
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
  var msgSplit = msg.content.split('.');
  if (msgSplit[0] === 'request') {
    console.log('1 received');
    if (msgSplit[1] === 'partner') {
      console.log('2 received');
      if (msgSplit[2].startsWith('(') & msgSplit[2].endsWith(')')) {
        console.log('3 received');
        var msgSplit_1 = msgSplit[2]
        msgSplit_1.slice(1,-1);
        var msgSplit2 = msgSplit_1.split(', ');
        var msgSplit3 = [];
        for (i = 0; i < msgSplit2.length; i++) {
          console.log('looping' + i);
          var temp = msgSplit2[i].split(': ');
          msgSplit3.push(temp[0], temp[1]);
        }
        console.log(msgSplit3);
        if (msgSplit3[0] === '(invite') {
          console.log('4 received');
          if (msgSplit3[1].includes('discordgg')) {
            console.log('5 received');
            if (msgSplit3[2] === 'desc') {
              console.log('6 received');
              var formated = `Invite: ${msgSplit3[1]} \n Owner: blah \n Description: ${msgSplit3[3]}`
              client.fetchUser('240550416129982464').then(user => {
                user.send(formated).then(msg => {
                  const filter = m => m.content === 'approve' | m.content === 'disapprove';
                  msg.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ['time'] })
                    .then(collected => console.log(collected.size))
                    .catch(collected => console.log('lectrician1 never responded'));
                });
              });
            }
          }
        }
      }
    }
  }
});

client.login(process.env.token);
