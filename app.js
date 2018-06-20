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
  var msgMatch = msg.content.match(/\([^()]*\)|[^.]+(?=\([^()]*\))|[^.]+/g);
  if (msgMatch[0] === 'request') {
    if (msgMatch[1] === 'partner') {
      if (msgMatch[2].startsWith('(') & msgMatch[2].endsWith(')')) {
        var parameter = msgMatch[2];
        var cutParameter = parameter.slice(1,-1);
        console.log(cutParameter);
        var splitParameter = cutParameter.split(', ');
        var parameterValues = [];
        for (i = 0; i < splitParameter.length; i++) {
          var temp = splitParameter[i].split(': ');
          parameterValues.push(temp[0], temp[1]);
        }
        console.log(parameterValues);
        if (parameterValues[0] === 'invite') {
          if (parameterValues[1].includes('discord.gg/')) {
            if (parameterValues[2] === 'desc') {
              if (parameterValues.length === 4 & parameterValues[3].length > 0) {
                client.fetchInvite('https://discord.gg/7S94fr2')
                  .then(invite => {
                    var requestResult = false;
                    invite.guild.roles.get('458768532210188308').members.forEach(function (key) {
                      client.fetchUser(key)
                        .then(user => {
                          user.createDM()
                            .then(DMchannel => {
                              var formated = `Please reply \`approve\` or \`disapprove\` to approve or disapprove of the following request.\n Invite: ${parameterValues[1]} \n Description: ${parameterValues[3]}`;
                              DMchannel.send(formated);
                                const filter = m => m.content === 'approve' | m.content === 'disapprove';
                                DMchannel.awaitMessages(filter, { max: 1, time: 86400000, errors: ['time'] })
                                  .then(collected => {
                                    if (requestResult === false) {
                                      if (collected.values().next().value == "approve") {
                                        requestResult === 'approved';
                                        DMchannel.send('Request approved.');
                                      }
                                      else if (collected.values().next().value == "disapprove") {
                                        requestResult === 'rejected';
                                        DMchannel.send('Request rejected.');
                                      }
                                    else {
                                      DMchannel.send(`The request has already been ${requestResult}.`);
                                    }
                                  })
                                  .catch(collected => console.log(`${DMchannel.recipient.username} never responded to request`));
                              }
                            });
                        }); 
                    });
                    msg.reply('Your request is in the process of being approved!');
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
