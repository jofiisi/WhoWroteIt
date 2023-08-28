import { View, Text} from "react-native";
import udpSocket from "react-native-udp";

const Search = ({ navigation }) => {
    let PORT = 6024;

    const client = udpSocket.createSocket('udp4');
    client.bind(PORT);
    client.on('message', function(msg, rinfo) {
        console.log('Message received', msg)
      })
    return (
        <View>
            <Text>
                Search
            </Text>
        </View>
    );
};

export default Search;