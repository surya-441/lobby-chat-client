import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { RootStackParamList } from "../../App";
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { socket } from "../services/socket";
import { LobbyList } from "../types/LobbyList";
import LobbyTable from "../components/LobbyTable";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: Props) => {
    const [maxPlayers, setMaxPlayers] = useState<string>("");
    const [joinCode, setJoinCode] = useState<string>("");
    const [creating, setCreating] = useState<boolean>(false);
    const [joining, setJoining] = useState<boolean>(false);
    const [lobbies, setLobbies] = useState<LobbyList[]>([]);

    useEffect(() => {
        socket.on("lobby_created", ({ lobbyId }: { lobbyId: string }) => {
            setCreating(false);
            navigation.navigate("Chat", { lobbyId });
        });

        socket.on("lobby_joined", ({ lobbyId }: { lobbyId: string }) => {
            setJoining(false);
            navigation.navigate("Chat", { lobbyId });
        });

        return () => {
            socket.off("lobby_created");
            socket.off("lobby_joined");
            socket.off("lobby_list");
        };
    }, [navigation]);

    useEffect(() => {
        socket.emit("get_lobbies");
        socket.on("lobby_list", (data: LobbyList[]) => {
            setLobbies(data);
        });
    }, []);

    // socket.emit("get_lobbies");
    console.log(lobbies);

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
                });
            }
        });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.select({ ios: "padding" })}
        >
            {lobbies.length > 0 && (
                <View style={styles.section}>
                    <LobbyTable lobbies={lobbies} />
                </View>
            )}
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
