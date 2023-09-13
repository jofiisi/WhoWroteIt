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
            let msgLobby = String(msg.slice(2));
            if (msg.slice(0, 2) == 'lb') {
                console.log("found lobby");
                if (lobbys.every(element => element.message != msgLobby))
                {
                    console.log('Checking message:', msgLobby);
                    
                    setLobbys(prevLobbys => [...prevLobbys, { message: msgLobby, address: rinfo.address }]);
                }else {
                    console.log('Lobby already listed');
                }
            }
        });

        client.on('error', (err) => {
            console.log('Socket error:', err);
        });

        return () => {
            client.close();
        };
    }, []);
    

    return (
        <View>
            <Text>
                Search
            </Text>
            {console.log(lobbys)}
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