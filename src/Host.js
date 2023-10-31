import { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, Button } from "react-native";
import udpSocket from "react-native-udp";

//remove when not using an Androidstudioemulator
const bcIP = '10.0.2.2'

const Host = ({ navigation }) => {
    let PORT = 6024;
    const [lobbyName, setLobbyname] = useState('');
    const [server, setServer] = useState(null);
    const repeatRef = useRef(null);
    const lobbyNameRef = useRef('');
    const [startedLobby, setStartedLobby] = useState(false);
    const [startedGame, setStartedGame] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const server = udpSocket.createSocket('udp4');

        server.bind(PORT);

        server.once('listening', function () {
            server.setBroadcast(true);
            server.send('Hosting', 0, 7, 6024, bcIP, function (err) {
                if (err) throw err;
                console.log('Message sent!');
            });
        });

        server.on('message', (msg, rinfo) => {
            console.log(`Received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
            let msgLobby = msg.slice(2).toString();
            if (msg.slice(0, 2) == 'UN') {
                console.log("found Users");
                setUsers
                // Use a callback function to ensure the correct value is used
                setUsers(prevUsers => {
                    if (!prevUsers.some(element => element.message === msgLobby)) {
                        console.log('Checked message:', msgLobby);
                        return [...prevUsers, { message: msgLobby, address: rinfo.address }];
                    } else {
                        console.log('User already listed');
                        return prevUsers;
                    }
                });
            }
        });

        setServer(server);

        return () => {
            server.close();
            clearInterval(repeatRef.current);
        };
    }, []);

    const hostLobby = () => {
        setStartedLobby(true);
        const currentLobbyName = lobbyNameRef.current;
        server.send('lb' + currentLobbyName, 0, currentLobbyName.length + 2, PORT, bcIP, function (err) {
            if (err) {
                console.error("Error sending message:", err);
            } else {
                console.log('Message sent!');
                if (!repeatRef.current) {
                    repeatRef.current = setInterval(() => {
                        hostLobby();
                    }, 2000);
                }
            }
        });
    };

    const startGame = () => {
        setStartedGame(true);
    };

    useEffect(() => {
        lobbyNameRef.current = lobbyName;
    }, [lobbyName]);

    if(startedGame)
    {
        return(
            <View>
                
            </View>
        );
    }

    if(startedLobby)
    {
        return(
            <View>
                {
                    users.length > 0 ?
                        (
                            users.map((users, index) => (
                                <View key={index}>
                                    <Text>{users.message}</Text>
                                </View>
                            ))
                        ) : (<Text>No Users yet</Text>)
                }
                <Button
                    title="start game"
                    onPress={startGame}
                />
            </View>
        );
    }

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
                title="host Lobby"
                onPress={hostLobby}
            />
        </View>
    );
};

export default Host;
