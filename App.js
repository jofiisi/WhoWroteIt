import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/Home';
import Search from './src/Search';
import Host from './src/Host';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
        />
        <Stack.Screen
          name='Search'
          component={Search}
        />
        <Stack.Screen
          name='Host'
          component={Host}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
