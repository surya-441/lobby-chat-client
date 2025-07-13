import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { RootStackParamList } from "../../App";
import {
    Alert,
    Button,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { socket } from "../services/socket";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

interface Lobby {
    code: string;
    name: string;
    participants: number;
}

const HomeScreen = ({ navigation }: Props) => {
    const [maxPlayers, setMaxPlayers] = useState<string>("4");
    const [joinCode, setJoinCode] = useState<string>("");
    const [creating, setCreating] = useState<boolean>(false);
    const [joining, setJoining] = useState<boolean>(false);

    useEffect(() => {
        socket.on("lobby_created", ({ lobbyId }: { lobbyId: string }) => {
            setCreating(false);
            navigation.navigate("Chat", { lobbyId });
        });

        socket.on("lobby_joined", ({ lobbyId }: { lobbyId: string }) => {
            setJoining(false);
            navigation.navigate("Chat", { lobbyId });
        });

        socket.on("error", (msg: string) => {});

        return () => {
            socket.off("lobby_created");
            socket.off("lobby_created");
        };
    }, [navigation]);

    const handleCreate = () => {
        const max = parseInt(maxPlayers, 10);
        if (isNaN(max) || max <= 0) {
            Alert.alert(
                "Invalid Input",
                "Max players must be a number greater than 0!"
            );
            return;
        }

        setCreating(true);
        socket.emit("create_lobby", max, (response) => {
            setCreating(false);
            if (response.error) {
                Alert.alert("Failed to create a lobby.", response.error);
            } else if (response.lobbyId) {
                navigation.navigate("Chat", {
                    lobbyId: response.lobbyId,
                    title: response.lobbyId,
                });
            }
        });
    };

    const handleJoin = () => {
        if (!joinCode.trim()) {
            Alert.alert("Missing code", "Please enter a lobby code.");
            return;
        }

        setJoining(true);
        socket.emit("join_lobby", { lobbyId: joinCode.trim() }, (response) => {
            setJoining(false);

            if (response.error) {
                Alert.alert("Failed to join the lobby", response.error);
            } else if (response.lobbyId) {
                navigation.navigate("Chat", {
                    lobbyId: response.lobbyId,
                    title: response.lobbyId,
                });
            }
        });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.select({ ios: "padding" })}
        >
            <View style={styles.section}>
                <Text style={styles.heading}>Create a Lobby</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    value={maxPlayers}
                    onChangeText={setMaxPlayers}
                    placeholder="Max players (e.g. 4)"
                />
                <Button
                    title={creating ? "Creating..." : "Create Lobby"}
                    onPress={handleCreate}
                    disabled={creating}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.heading}>Join a Lobby</Text>
                <TextInput
                    style={styles.input}
                    value={joinCode}
                    onChangeText={setJoinCode}
                    placeholder="Enter lobby code"
                    autoCapitalize="none"
                />
                <Button
                    title={joining ? "Joining..." : "Join Lobby"}
                    onPress={handleJoin}
                    disabled={joining}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
    },
    section: { marginVertical: 16 },
    heading: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        borderRadius: 4,
        marginBottom: 12,
    },
});
