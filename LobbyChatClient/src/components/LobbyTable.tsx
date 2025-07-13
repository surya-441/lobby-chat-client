import React from "react";
import { LobbyList } from "../types/LobbyList";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface Props {
    lobbies: LobbyList[];
}

const LobbyTable = ({ lobbies }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Lobby Name</Text>
                <Text style={styles.headerCell}>Participants</Text>
            </View>

            <FlatList
                data={lobbies}
                keyExtractor={(item) => item.lobbyName}
                renderItem={({ item }) => {
                    console.log("rendering item: ", item);
                    return (
                        <View style={styles.row}>
                            <Text style={styles.cell}>{item.lobbyName}</Text>
                            <Text style={styles.cell}>
                                {item.participantCount}/{item.maxCount}
                            </Text>
                        </View>
                    );
                }}
            />
        </View>
    );
};

export default LobbyTable;

const styles = StyleSheet.create({
    container: { marginVertical: 16 },
    headerRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingBottom: 4,
    },
    headerCell: { flex: 1, fontWeight: "bold" },
    row: {
        flexDirection: "row",
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    cell: { flex: 1 },
});
