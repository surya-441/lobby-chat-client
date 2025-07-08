import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import ChatScreen from "./src/screens/ChatScreen";

export type RootStackParamList = {
    Home: undefined;
    Chat: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{ headerTitleAlign: "center" }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: "Lobby List" }}
                />
                <Stack.Screen
                    name="Chat"
                    component={ChatScreen}
                    options={{ title: "Game Lobby Chat" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
