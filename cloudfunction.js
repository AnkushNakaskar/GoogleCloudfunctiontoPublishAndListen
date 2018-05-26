var express = require('express');
const bodyParser = require("body-parser");
const PubSub = require('@google-cloud/pubsub');
const projectId = 'content-eng-qa';
const pubsubClient = new PubSub({
    projectId: projectId,
    keyFilename: 'keyfile.json'

});
const topicName = 'my-new-test';


var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.put('/', function (req, res) {
    content=req.body;
    if(content){
        if(content.type){
            contentType=content.type;
            switch(contentType){
                case "clip":
                    console.log("Input entity is clip..!!");
                    publishMessage(content,"testtopicankush");
                    listenForMessages("testsubscriptionankush",10)
                    break;
                case "playlist":
                    console.log("Input entity is playlist..!!");
                    break;
            }
        }else{
            console.log("Invalid content")
        }
        console.log("Ankush!!")
        console.log(content);
    }
    res.send('Hello World!');
})
function listenForMessages(subscriptionName, timeout) {


    const subscription = pubsubClient.subscription(subscriptionName);

    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = function (message) {
        var temp = JSON.parse(message.data.toString());
        console.log("\n");
        console.log(temp);
        console.log(message.attributes);
        messageCount += 1;
        message.ack();
    };
    subscription.on("message", messageHandler);
}

function publishMessage(messages,topicName){
    data=JSON.stringify(messages);
    const dataBuffer = Buffer.from(data);
    pubsubClient.topic(topicName).publisher().publish(dataBuffer).then(function(messageId){
        console.log("Published message successfully..with message Id : ${messageId}")
    }).catch(function(err){
        console.log("Error in publishing message",err);
    })
    console.log("Ankush you are great..!!")
}
function createTopic(topicName){
    pubsubClient.createTopic(topicName).then(function(results){
        const topic = results[0];
        console.log("Topic ${topic.name} created.");
    }).catch(function(err) {
        console.error('ERROR:', err);
    });
}

app.get('/', function (req, res) {
    content=req.body;
    console.log("Ankush!!")
    console.log(content);
    res.send('Hello World!');
})

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
})
