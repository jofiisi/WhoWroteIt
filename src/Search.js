import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import udpSocket from "react-native-udp";

const Search = ({ navigation }) => {
    let PORT = 6024;

    const [lobbys, setLobbys] = useState([]);

    useEffect(() => {
        const client = udpSocket.createSocket('udp4');

        client.bind(6024);

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
    }, []); // Empty dependency array, so this effect only runs once
//comments by chatgpt, asychronus state cause a headache
    return (
        <View>
            <Text>
                Search
            </Text>
            {
                lobbys.length > 0 ?
                    (
                        lobbys.map((lobby, index) => (
                            <View key={index}>
                                <Text>{String(lobby.message)}</Text>
                            </View>
                        ))
                    ) : (<Text>No Lobbys found yet</Text>)
            }
        </View>
    );
};

export default Search;
