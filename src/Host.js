import { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, Button } from "react-native";
import udpSocket from "react-native-udp";

const Host = ({ navigation }) => {
    let PORT = 6024;
    const [lobbyName, setLobbyname] = useState('');
    const [server, setServer] = useState(null);
    const repeatRef = useRef(null);
    const lobbyNameRef = useRef('');

    useEffect(() => {
        const server = udpSocket.createSocket('udp4');

        server.bind(PORT);

        server.once('listening', function () {
            server.setBroadcast(true);
            server.send('Hosting', 0, 7, 6024, '255.255.255.255', function (err) {
                if (err) throw err;
                console.log('Message sent!');
            });
        });

        setServer(server);

        return () => {
            server.close();
            clearInterval(repeatRef.current);
        };
    }, []);

    const startLobby = () => {
        const currentLobbyName = lobbyNameRef.current;
        server.send('lb' + currentLobbyName, 0, currentLobbyName.length + 2, PORT, '255.255.255.255', function (err) {
            if (err) {
                console.error("Error sending message:", err);
            } else {
                console.log('Message sent!');
                if (!repeatRef.current) {
                    repeatRef.current = setInterval(() => {
                        startLobby();
                    }, 2000);
                }
            }
        });
    };

    useEffect(() => {
        lobbyNameRef.current = lobbyName;
    }, [lobbyName]);

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

export default Host;
