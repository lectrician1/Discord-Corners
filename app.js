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
              if (msgSplit.length === 4) {
                client.fetchInvite('https://discord.gg/7S94fr2')
                  .then(invite => {
                    var requestResult = false;
                    invite.guild.roles.get('458768532210188308').members.forEach(function (key) {
                      client.fetchUser(key)
                        .then(user => {
                          user.createDM()
                            .then(DMchannel => {
                              var formated = `Please reply \`approve\` or \`disapprove\` to approve or disapprove of the following request.\n Invite: ${msgSplit3[1]} \n Description: ${msgSplit3[3]}`;
                              DMchannel.send(formated);
                              msg.reply('Your request is in the process of being approved!');
                              if (requestResult === false) {
                                const filter = m => m.content === 'approve' | m.content === 'disapprove';
                                DMchannel.awaitMessages(filter, { max: 1, time: 86400000, errors: ['time'] })
                                  .then(collected => {
                                    if (collected.values().next().value == "approve") {
                                      requestResult === true;
                                      DMchannel.send('Request approved.');
                                    }
                                    else if (collected.values().next().value == "disapprove") {
                                      requestResult === true;
                                      DMchannel.send('Request rejected.');
                                    }
                                  })
                                  .catch(collected => console.log(`${DMchannel.recipient.username} never responded to request`));
                              }
                              else {
                                DMchannel.send('The request has been approved');
                              }
                            });
                        }); 
                    });
                  });
              }
              else {
                msg.reply('Please include a description of your server with your request.');
              }
            }
            else {
              msg.reply('The second parameter should be a description. Label this \`desc\`.');
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
      else {
        msg.send('Parameters should be wrote in parentheses after the property.');
      }
    }
    else {
      msg.reply('That is not a valid property of \`request\`.');
    }
  }
});

client.login(process.env.token);
