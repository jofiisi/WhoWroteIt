import { View, Text, Button } from "react-native";

//remove when not using an Androidstudioemulator
const bcIP = '10.0.2.2'

const HomeScreen = ({ navigation }) => {

    return (
        <View>
            <Text>
                Home
            </Text>
            <Button
                title='Search'
                onPress={() => navigation.navigate('Search')}
            />
            <Button
                title='Host'
                onPress={() => navigation.navigate('Host')}
            />
        </View>
    );
};

export default HomeScreen;