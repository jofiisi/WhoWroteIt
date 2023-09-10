import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import udpSocket from "react-native-udp";

const Search = ({ navigation }) => {
    let PORT = 6024;

    const [lobbys, setLobbys] = useState([]);

    useEffect(() => {
        const client = udpSocket.createSocket('udp4');

        client.bind(6024);

        client.on('message', (msg, rinfo) => {
            console.log(`Received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
            if (msg.slice(0, 2) == 'lb') {
                console.log("found lobby");
                setLobbys(prevLobbys => [...prevLobbys, msg.slice(2)]);
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

            {
                lobbys.length > 0 ? 
                (
                    lobbys.map((lobby, index) => (
                        <View key={index}>
                            <Text>{lobby}</Text>
                        </View>
                    ))
                ) : (<Text>No Lobbys found yet</Text>)
            
            }
        </View>
    );
};

export default Search;