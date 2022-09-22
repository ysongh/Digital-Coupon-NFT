import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Client } from '@xmtp/xmtp-js';
import { Flex, Center, Box, FormControl, InputGroup, InputRightElement, Input, FormLabel, Badge, Button, Text } from '@chakra-ui/react';

function Chat({ userSigner, ethAddress }) {
  const router = useRouter();
  const { address } = router.query;

  const [xmtpMethod, setxmtpMethod] = useState(null);
  const [conversationMethod, setconversationMethod] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [toAddress, setToAddress] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const connect = async () => {
    const xmtp = await Client.create(userSigner);
    console.log(xmtp);
    setxmtpMethod(xmtp);
    setToAddress(address);
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
    setNewMessage('');
  }

  return (
    <div>
      {!xmtpMethod
        ? <Flex direction='column' align='center' mt='16'>
            <Button colorScheme='orange' onClick={connect} mb='1'>
              Connect to XMTP
            </Button>
            <Text>Powered by XMTP</Text>
          </Flex>
        : <Center>
            <Box borderWidth='1px' borderRadius='lg' borderColor='orange' overflow='hidden' p='5' width='600px' mt='5'>
              <h2>Chat</h2>
              <FormControl mb='3'>
                <FormLabel htmlFor='address'>Address to Chat With</FormLabel>
                <Input id="address" value={address} onChange={(e) => setToAddress(e.target.value)}/>
              </FormControl>
             
              <Button colorScheme='orange'  onClick={chatWith}>
                Chat
              </Button>
            </Box>
          </Center>
      }
      {conversationMethod && <Center>
          <Box borderWidth='1px' borderRadius='lg' borderColor='orange' overflow='hidden' p='5' width='600px' mt='5'>
            <h2>Messages to {toAddress}</h2>
            {messagesList.map(m => (
              <Text align={m.senderAddress === ethAddress ? "right" : "left"} key={m.id}>
                <Badge colorScheme={m.senderAddress === ethAddress && "orange"}>
                  {m.content}
                </Badge>
              </Text>
            ))}
            <InputGroup size='md' mt='3'>
              <Input
                pr='4.5rem'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={sendMessage}>
                  Send
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </Center>
      }
    </div>
  )
}

export default Chat;