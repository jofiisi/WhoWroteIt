import { View, Text} from "react-native";
import udpSocket from "react-native-udp";

const Host = ({ navigation }) => {
    let PORT = 6024;

    const server = udpSocket.createSocket('udp4');
    server.bind(PORT,() => {
        server.setBroadcast(true)
    });

    server.send("test", 0, 4, PORT, '255.255.255.255', err => {
        if (err) {
          console.error('Error sending message:', err);
        } else {
          console.log('Broadcast message sent successfully.');
        }
      })

    return (
        <View>
            <Text>
                Host
            </Text>
        </View>
    );
};

export default Host;