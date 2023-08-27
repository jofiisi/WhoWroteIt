import { View, Text, Button } from "react-native";

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