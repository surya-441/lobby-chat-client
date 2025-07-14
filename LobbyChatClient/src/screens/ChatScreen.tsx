import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, GiftedChat, IMessage, User } from "react-native-gifted-chat";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { AITypes } from "../types/aiTypes";
import { socket } from "../services/socket";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

const ChatScreen = ({ route }: Props) => {
    const { lobbyId } = route.params;
    const [messages, setMessages] = React.useState<IMessage[]>([]);
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `Lobby ID: ${lobbyId}`,
        });
    }, [navigation, lobbyId]);

    useEffect(() => {
        socket.on(
            "chat_message",
            ({ from, text }: { from: string; text: string }) => {
                const incoming: IMessage = {
                    _id: Date.now().toString(),
                    text,
                    createdAt: new Date(),
                    user: { _id: from } as User,
                };
                setMessages((prev) => [incoming, ...prev]);
            }
        );

        socket.on(
            "participant_left",
            ({ leavingParticipant }: { leavingParticipant: string }) => {
                const message: IMessage = {
                    _id: Date.now().toString(),
                    text: `${leavingParticipant} has left the lobby`,
                    createdAt: new Date(),
                    user: { _id: "system" },
                    system: true,
                };
                setMessages((prev) => [message, ...prev]);
            }
        );

        return () => {
            console.log("disconnecting...");
            socket.off("chat_message");
            // socket.disconnect();
        };
    }, [lobbyId]);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        if (newMessages.length === 0) return;

        console.log(newMessages);

        const [firstMessage] = newMessages;

        socket.emit("chat_message", { lobbyId, text: firstMessage.text });

        setMessages((prev) => GiftedChat.append(prev, [firstMessage]));
    }, []);

    return (
        <GiftedChat
            messages={messages}
            onSend={(msgs) => onSend(msgs)}
            user={{ _id: "me" } as User}
            showAvatarForEveryMessage
            renderAvatar={(props) => {
                if (props.currentMessage.user.avatar) {
                    return (
                        <Avatar
                            {...props}
                            imageStyle={{
                                left: { borderRadius: 20 },
                                right: { borderRadius: 20 },
                            }}
                        />
                    );
                }
                const id = String(props.currentMessage.user._id);
                const letter = id.charAt(0).toUpperCase();
                const ai: boolean = AITypes.includes(id);
                return (
                    <View style={styles.avatar}>
                        <Text style={styles.letter}>{ai ? "AI" : letter}</Text>
                    </View>
                );
            }}
        />
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    avatar: {
        backgroundColor: "#4F6D7A",
        height: 32,
        width: 32,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    letter: {
        color: "#FFF",
        fontWeight: "600",
    },
});
