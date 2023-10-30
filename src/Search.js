import { useEffect, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import udpSocket from "react-native-udp";

const Search = ({ navigation }) => {
    let PORT = 6024;

    const [lobbys, setLobbys] = useState([]);
    const [Name, setName] = useState('');
    const [client, setClient] = useState(null);
    const [repeat, setRepeat] = useState(null);

    useEffect(() => {
        const client = udpSocket.createSocket('udp4');

        client.bind(6024);
        setClient(client);
        client.on('message', (msg, rinfo) => {
            console.log(`Received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
            let msgLobby = msg.slice(2).toString();
            if (msg.slice(0, 2) == 'lb') {
                console.log("found lobby");

                // Use a callback function to ensure the correct value is used
                setLobbys(prevLobbys => {
                    if (!prevLobbys.some(element => element.message === msgLobby)) {
                        console.log('Checked message:', msgLobby);
                        return [...prevLobbys, { message: msgLobby, address: rinfo.address }];
                    } else {
                        console.log('Lobby already listed');
                        return prevLobbys;
                    }
                });
            }
        });
        return () => {
            client.close();
            clearInterval(repeat);
        }
    }, []); // Empty dependency array, so this effect only runs once
    //comments up to here by chatgpt, asychronus state cause a headache

    const connect2Lobby = (index) => {
        client.send('UN' + Name + 'lb' + lobbys[index].message, 0, Name.length + 4 + lobbys[index].message.length, PORT, lobbys[index].address);
        if (repeat == null) {
            const interval = setInterval(() => {
                connect2Lobby();
            }, 2000);
            setRepeat(interval);
        }
    }

    return (
        <View>
            <Text>
                Search
            </Text>
            <TextInput
                placeholder="User Name"
                onChangeText={text => { setName(text) }}
            />
            {
                lobbys.length > 0 ?
                    (
                        lobbys.map((lobby, index) => (
                            <View key={index}>
                                <Button
                                    title={String(lobby.message)}
                                    onPress={fct => connect2Lobby(index)}
                                />
                            </View>
                        ))
                    ) : (<Text>No Lobbys found yet</Text>)
            }
        </View>
    );
};

export default Search;
