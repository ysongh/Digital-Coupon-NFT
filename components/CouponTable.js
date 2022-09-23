import React, { useEffect, useState } from 'react';
import { connect, resultsToObjects } from "@tableland/sdk";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  FormControl,
  FormLabel,
  Input,
  Button
} from '@chakra-ui/react';

function CouponTable({ chainName }) {
  const [tablelandMethods, setTablelandMethods] = useState(null);
  const [tableName, setTableName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    connectTableland();
  }, [])

  const connectTableland = async () => {
    const tableland = connect({ network: "testnet", chain: {chainName } });
    await tableland.siwe();
    setTablelandMethods(tableland);

    const tables = await tableland.list();
    console.log(tables);

    if(tables.length){
      setTableName(tables[0].name);
      const readRes = await tableland.read(`SELECT * FROM ${tables[0].name};`);
      console.log(readRes);

      formatData(readRes);
    }
  }

  const formatData = async (results) => {
    const entries = resultsToObjects(results);

    let temp = [];
    for (const { name, id } of entries) {
      console.log(`${name}: ${id}`);
      temp.push({ id, name: name});
    }

    console.log(temp);
    setMessages(temp);
  }

  const insertDataToTable = async (id) => {
    const writeRes = await tablelandMethods.write(`INSERT INTO ${tableName} (id, name) VALUES ('${id}', '${text}');`);
    console.log(writeRes);
  }
  
  return (
    <TableContainer>
      <FormControl mb='3'>
        <FormLabel htmlFor='message'>Message</FormLabel>
        <Input id='message' onChange={(e) => setText(e.target.value)}/>
      </FormControl>
      <Button colorScheme='orange' onClick={insertDataToTable}>
        Add
      </Button>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Message</Th>
          </Tr>
        </Thead>
        <Tbody>
          {messages.map(m => (
            <Tr key={m.id}>
              <Td>{m.id}</Td>
              <Td>{m.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default CouponTable;