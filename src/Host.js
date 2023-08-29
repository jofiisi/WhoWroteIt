import { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import udpSocket from "react-native-udp";

const Host = ({ navigation }) => {
    let PORT = 6024;
    const [lobbyName, setLobbyname] = useState('');

    useEffect(() => {
        const server = udpSocket.createSocket('udp4');

        server.bind(PORT, () => {
            server.setBroadcast(true)
        })

        server.once('listening', function() {
            
            server.send('Hosting', 0, 7, 6024, '255.255.255.255', function(err) {
              if (err) throw err
          
              console.log('Message sent!')
            })
          })

        return () => {
            server.close();
        }
    }, []);

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
            />
        </View>
    );
};

export default Host