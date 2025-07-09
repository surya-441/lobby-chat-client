import React, { useCallback, useEffect } from "react";
import { Text, View } from "react-native";
import { GiftedChat, IMessage, User } from "react-native-gifted-chat";
import { socket } from "../services/socket";

const ChatScreen = () => {
    const [messages, setMessages] = React.useState<IMessage[]>([]);

    useEffect(() => {
        socket.on(
            "chat_message",
            ({ from, text }: { from: string; text: string }) => {
                const incoming: IMessage = {
                    _id: Date.now(),
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
    }, []);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        const [first] = newMessages;
        if (first && first.text) {
            socket.emit("chat_message", first.text);
            setMessages((prev) => [...newMessages, ...prev]);
        }
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
