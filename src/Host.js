import { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, Button } from "react-native";
import udpSocket from "react-native-udp";

//remove when not using an Androidstudioemulator
const bcIP = '10.0.2.2' // 255.255.255.255, 10.0.2.2

const Host = ({ navigation }) => {
    let PORT = 6024;
    const [lobbyName, setLobbyname] = useState('');
    const [server, setServer] = useState(null);
    const indexGuesser = useRef(null);
    const repeatRef = useRef(null);
    const lobbyNameRef = useRef('');
    const [startedLobby, setStartedLobby] = useState(false);
    const [startedGame, setStartedGame] = useState(false);
    const [users, setUsers] = useState([]);
    const [isSendingGameData, setIsSendingGameData] = useState(false);
    const [Name, setName] = useState('');
    
    useEffect(() => {
        const server = udpSocket.createSocket('udp4');

        server.bind(PORT);

        server.once('listening', function () {
            //server.setBroadcast(true);
            server.send('Hosting', 0, 7, 6024, bcIP, function (err) {
                if (err) throw err;
                console.log('Message sent!');
            });
        });

        server.on('message', (msg, rinfo) => {
            console.log(`Received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
            let msgText = msg.slice(2).toString();
            if (msg.slice(0, 2) == 'MG') {
                console.log("found Text");
                // Use a callback function to ensure the correct value is used
                setUsers(prevUsers => {
                    return prevUsers.map((user) => {
                        if ((user.address == rinfo.address)/* && (prevUsers[indexGuesser.current].address != rinfo.address)*/) {
                            if (user.text == null) {
                                return { ...user, text: msgText };
                            }
                        }
                        return user;
                    })}
                );
            }

            if (msg.slice(0, 2) == 'UN') {
                console.log("found Users");
                // Use a callback function to ensure the correct value is used
                setUsers(prevUsers => {
                    if (!prevUsers.some(element => element.message === msgText)) {
                        console.log('Checked message:', msgText);
                        return [...prevUsers, { message: msgText, address: rinfo.address, text: null }];
                    } else {
                        console.log('User already listed');
                        return prevUsers;
                    }
                });
            }

        });

        setServer(server);

        return () => {
            setIsSendingGameData(false);
            console.log("closing udp");
            clearInterval(repeatRef.current);
            server.close();
        };
    }, []);

    const hostLobby = () => {
        setStartedLobby(true);
        if(users == [])
        {
            
        }
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

    const sendGameData = () => {
        for (let y = 0; y < users.length; y++) {
            console.log(users[y].message);
            
        }
        let stringUsers = JSON.stringify(users);
        for (let i = 0; i < users.length; i++) {
            server.send('GD' + stringUsers, 0, 2 + stringUsers.length, PORT, users[i].address);  
            console.log(indexGuesser.current);
            server.send('GUID' + indexGuesser.current.toString(), 0, 4 + indexGuesser.current.toString().length, PORT, users[i].address);
        }
    }

    useEffect(() => {
        if(isSendingGameData)
        {
            clearInterval(repeatRef.current);
            repeatRef.current = setInterval(() => {
                sendGameData();
            }, 2000);
        }
    }, [users]);

    const startGame = (index) => {
        indexGuesser.current = index;
        setStartedGame(true);
        clearInterval(repeatRef.current);
        setIsSendingGameData(true);
        repeatRef.current = setInterval(() => {
            sendGameData();
        }, 2000);
    };

    useEffect(() => {
        lobbyNameRef.current = lobbyName;
    }, [lobbyName]);

    if (startedGame) {
        return (
            <View>
                {
                    users.length > 0 ?
                        (
                            users.map((users, index) => (
                                <View key={index}>
                                    <Text>
                                        {users.address}
                                        {users.message}
                                        {users.text}
                                    </Text>
                                </View>
                            ))
                        ) : (<Text>No Users yet</Text>)
                }
            </View>
        );
    }

    if (startedLobby) {
        return (
            <View>
                <Text>
                    Pick Guesser to start game!
                </Text>
                {
                    users.length > 0 ?
                        (
                            users.map((users, index) => (
                                <View key={index}>
                                    <Button
                                        title={String(users.message)}
                                        onPress={fct => startGame(index)}
                                    />
                                </View>
                            ))
                        ) : (<Text>No Users yet</Text>)
                }
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
                onChangeText={text => { setLobbyname(text);
            }}
            />
            <Text>
                User Name
            </Text>
            <TextInput
                placeholder="User Name"
                onChangeText={text => { setName(text) }}
            />
            <Button
                title="host Lobby"
                onPress={() => {hostLobby(); setUsers([{message: Name, address: "127.0.0.1", text: null}]);}}
            />
        </View>
    );
};

export default Host;
