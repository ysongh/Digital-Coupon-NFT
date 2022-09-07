import React, { useState } from 'react';
import { Client } from '@xmtp/xmtp-js';

function Chat({ userSigner }) {
  const [xmtpMethod, setxmtpMethod] = useState(null);
  const [conversationMethod, setconversationMethod] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [toAddress, setToAddress] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const connect = async () => {
    const xmtp = await Client.create(userSigner);
    console.log(xmtp);
    setxmtpMethod(xmtp);
  }

  const chatWith = async () => {
    const conversation = await xmtpMethod.conversations.newConversation(toAddress);
    setconversationMethod(conversation);

    const messages = await conversation.messages();
    console.log(messages);
    setMessagesList(messages);

    for await (const message of await conversation.streamMessages()) {
      console.log(`[${message.senderAddress}]: ${message.content}`)
      setMessagesList([...messages, message]);
    }
  }

  const sendMessage = async () => {
    await conversationMethod.send(newMessage);
  }

  return (
    <div>
      {!xmtpMethod
        ? <button onClick={connect}>Connect to XMTP</button>
        : <div>
            <h2>Chat</h2>
            <label htmlFor="address">Address to Chat With</label>
            <input id="address" onChange={(e) => setToAddress(e.target.value)}/>
            <button onClick={chatWith}>
              Chat
            </button>
          </div>
      }
      {conversationMethod && <div>
        <h2>Messages to {toAddress}</h2>
        {messagesList.map(m => (
          <p key={m.id}>{m.content}</p>
        ))}
        <div>
          <label htmlFor="message">Message</label>
          <input id="message" onChange={(e) => setNewMessage(e.target.value)}/>
        </div>
        <button onClick={sendMessage}>
            Send Message
          </button>
      </div>}
    </div>
  )
}

export default Chat;