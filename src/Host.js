import { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import udpSocket from "react-native-udp";

const Host = ({ navigation }) => {
    let PORT = 6024;
    const [lobbyName, setLobbyname] = useState('');
    const [server, setServer] = useState(null);

    useEffect(() => {
        const server = udpSocket.createSocket('udp4');

        server.bind(PORT);

        server.once('listening', function () {
            server.setBroadcast(true);
            server.send('Hosting', 0, 7, 6024, '255.255.255.255', function (err) {
                if (err) throw err

                console.log('Message sent!')
            })
        })

        setServer(server);

        return () => {
            server.close();
        }
    }, []);

    const startLobby = () => {
        server.send('lb' + lobbyName, 0, lobbyName.length + 2, PORT, '255.255.255.255', function (err) {
            if (err) {
                console.error("Error sending message:", err);
            } else {
                console.log('Message sent!')
            }
        });
    };

    return (
        <View>
            <Text>
                Host
            </Text>
            <TextInput
                placeholder="Lobby Name"
                onChangeText={text => { setLobbyname(text) }}
            />
            <Button
                title="start Lobby"
                onPress={startLobby}
            />
        </View>
    );
};

export default Host