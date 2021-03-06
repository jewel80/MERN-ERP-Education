const express = require('express');
const ChatModel = require('../models/ChatModel.js');
const {
  sendFriendRequest,
  sendMessage,
} = require('../middlewares/validate.js');

const twilio = require('twilio');
const route = express.Router();
const client = twilio(
    'AC51f723aa6502de76159b45a4a965fcf5',
    '80f6b2af38997bd4b9740bd0fb75419e'
  );
// const client = twilio(
//   'AC2d8f240cc53fc786e49062653a9c2174',
//   '21bf89b4749aba5519f00783d6cb70e3'
// );

route.get('/', async (req, res) => {
  const docs = await ChatModel.find().sort({
    createdAt: 'desc',
  });
  res.json(docs);
});

route.post('/user', async (req, res) => {
  await ChatModel.create(req.body)
    .then(doc => {
      res.send(JSON.stringify({ success: true, doc }));
    })
    .catch(err => {
      console.log(err, 'error');
      res.send(
        JSON.stringify({
          error: `Failed`,
        })
      );
    });
});

route.post('/', (req, res) => {
  client.messages
    .create({
      from: '+88019283355',
      to: req.body.telephone,
      body: req.body.message,
    })
    .then(async () => {
      //console.log("message send");
      await ChatModel.create(body);
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err, 'error');
      res.send(
        JSON.stringify({
          error: `Number ${req.body.telephone} is not a valid phone number`,
        })
      );
    });
});

//get chat uer
route.get('/user/:id', async (req, res) => {
  if (!req.params.id) {
    return res.json({ success: false, error: ' id is required' });
  }
  const messageChats = await ChatModel.find({
    userID: req.params.id,
  });
  res.json(messageChats);
});

route.get('/send/:id', async (req, res) => {
  if (!req.params.id) {
    return res.json({ success: false, error: ' id is required' });
  }
  const messageChats = await ChatModel.find({
    sender: req.params.id,
  });
  res.json(messageChats);
});

//create  user connection
route.get('/connection/:id', async (req, res) => {
  if (!req.params.id) {
    return res.json({ success: false, error: ' id is required' });
  }
  const messageChats = await ChatModel.find({
    $or: [{ acceptor_id: req.params.id }, { requestor_id: req.params.id }],
  });
  res.json(messageChats);
});

//get user connections
route.get('/chats/:id', async (req, res) => {
  if (!req.params.id) {
    return res.json({ success: false, error: ' id is required' });
  }
  const messageChats = await ChatModel.find({
    $or: [{ acceptor_id: req.params.id }, { requestor_id: req.params.id }],
  });
  res.json(messageChats);
});

//get channel chatMessage
route.get('/chat/:id', async (req, res) => {
  if (!req.params.id) {
    return res.json({ success: false, error: ' id is required' });
  }
  console.log(req.params.id);
  ChatModel.findOne({ _id: req.params.id })
    .then(doc => {
      console.log(doc, 'doc');
      return res.json(doc);
    })
    .catch(err => {
      console.log(err, 'err');
      return res.json({ success: false, message: 'something when wrong' });
    });
});

//get notification messages
route.get('/messages/:id', async (req, res) => {
  if (!req.params.id) {
    return res.json({ success: false, message: ' id is required' });
  }
  ChatModel.find({
    $or: [{ acceptor_id: req.params.id }, { requestor_id: req.params.id }],
  })
    .then(doc => {
      let messages = doc.map(e => e.messages);
      let Allmessages = [].concat.apply([], messages);
      return res.json(Allmessages);
    })
    .catch(err => {
      console.log(err, 'err');
      return res.json({ success: false, message: 'something when wrong' });
    });
});

//create connection
route.post('/create', async (req, res) => {
  let body = req.body;
  // const { error } = sendFriendRequest.validate(body);
  // if (error) {
  //   console.log(error);
  //   return res.json({ success: false, error: error.details[0].message });
  // }
  //check if there is aconnection already
  const checkConnection = await ChatModel.findOne({
    acceptor_id: body.acceptor_id,
    requestor_id: body.requestor_id,
  });

  console.log(checkConnection, 'connection');

  if (checkConnection) {
    return res.json({ doc: checkConnection });
  }

  await ChatModel.create(body)
    .then(doc => {
      return res.json({ success: true, doc });
    })
    .catch(err => {
      console.log(err);
      return res.json({ success: false, error: err });
    });
});

//send to userid
route.post('/send/user/:id/:id2', async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Missing URL parameter: username');
  }
  //find connects
  const checkConnection = await ChatModel.findOne({
    $or: [
      { requestor_id: req.params.id, acceptor_id: req.params.id2 },
      { requestor_id: req.params.id2, acceptor_id: req.params.id1 },
    ],
  });

  //if no connection , create one
  if (!checkConnection) {
    ChatModel.create({
      requestor_id: req.params.id,
      acceptor_id: req.params.id2,
    })
      .then(response => {
        ChatModel.findOneAndUpdate(
          {
            _id: response._id,
          },
          { $push: { messages: req.body } },
          {
            new: true,
          }
        )
          .then(doc => {
            if (!doc) {
              return res.json({ success: false, error: 'doex not exists' });
            }
            return res.json({ success: true, doc });
          })
          .catch(err => {
            res.json({ success: false, error: err });
          });
      })
      .catch(err => {
        return res.json({ success: false, error: err });
      });
  } else {
    ChatModel.findOneAndUpdate(
      {
        _id: checkConnection._id,
      },
      { $push: { messages: req.body } },
      {
        new: true,
      }
    )
      .then(doc => {
        if (!doc) {
          return res.json({ success: false, error: 'doex not exists' });
        }
        return res.json({ success: true, doc });
      })
      .catch(err => {
        res.json({ success: false, message: err });
      });
  }
  //send message
});

//send message
route.put('/send/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Missing URL parameter: username');
  }

  const { error } = sendMessage.validate(req.body);
  if (error) {
    console.log(error);
    return res.json({ success: false, error: error.details[0].message });
  }

  //check whether there is connection
  const checkConnection = ChatModel.findOne({
    _id: req.params.id,
    status: true,
  });

  if (!checkConnection) {
    return res.json({ success: false, error: 'you are not friends' });
  }

  ChatModel.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    { $push: { messages: req.body } },
    {
      new: true,
    }
  )
    .then(doc => {
      console.log(doc);
      if (!doc) {
        return res.json({ success: false, error: 'doex not exists' });
      }
      return res.json({ success: true, doc });
    })
    .catch(err => {
      res.json({ success: false, message: err });
    });
});

//delete message
route.delete('/deletes/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Missing URL parameter: username');
  }

  const { error } = sendMessage.validate(req.body);
  if (error) {
    console.log(error);
    return res.json({ success: false, error: error.details[0].message });
  }

  //check whether there is connection
  const checkConnection = ChatModel.findOne({
    _id: req.params.id,
  });

  if (!checkConnection) {
    return res.json({ success: false, error: 'you are not friends' });
  }

  ChatModel.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    { $pushAll: { messages: { _id: req.body.id } } },
    {
      new: true,
    }
  )
    .then(doc => {
      console.log(doc);
      if (!doc) {
        return res.json({ success: false, error: 'doex not exists' });
      }
      return res.json({ success: true, doc });
    })
    .catch(err => {
      res.json({ success: false, message: err });
    });
});

//delete all messages
route.delete('/deleteAll/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Missing URL parameter: username');
  }

  const { error } = sendMessage.validate(req.body);
  if (error) {
    console.log(error);
    return res.json({ success: false, error: error.details[0].message });
  }

  //check whether there is connection
  const checkConnection = ChatModel.findOne({
    _id: req.params.id,
  });

  if (!checkConnection) {
    return res.json({ success: false, error: 'you are not friends' });
  }

  ChatModel.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    { messages: [] },
    {
      new: true,
    }
  )
    .then(doc => {
      console.log(doc);
      if (!doc) {
        return res.json({ success: false, error: 'does not exists' });
      }
      return res.json({ success: true, doc });
    })
    .catch(err => {
      res.json({ success: false, message: err });
    });
});

route.delete('/delete/:id', (req, res) => {
  ChatModel.findOneAndDelete({ _id: req.params.id }).then(e => {
    res.json({ doc: e });
  });
});
route.delete('/deleteAll', (req, res) => {
  ChatModel.deleteMany({}).then(docs => {
    res.json({ docs });
  });
});

module.exports = route;
