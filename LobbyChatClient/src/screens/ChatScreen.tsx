import React, { useCallback, useEffect } from "react";
import { Text, View } from "react-native";
import { GiftedChat, IMessage, User } from "react-native-gifted-chat";
import { socket } from "../services/socket";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

const ChatScreen = ({ route }: Props) => {
    const { lobbyId } = route.params;
    const [messages, setMessages] = React.useState<IMessage[]>([]);

    useEffect(() => {
        socket.emit("join_lobby", { lobbyId }, (response) => {
            if (response.error) {
                console.error("Failed to join lobby: ", response.error);
            } else {
                console.log(`Joined lobby ${lobbyId}`);
            }
        });

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

        return () => {
            socket.off("chat_message");
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
        />
    );
};

export default ChatScreen;
