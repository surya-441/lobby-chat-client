import React, { useCallback, useEffect } from "react";
import { Text, View } from "react-native";
import { GiftedChat, IMessage, User } from "react-native-gifted-chat";
import { socket } from "../services/socket";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

const ChatScreen = ({ route }: Props) => {
  const [messages, setMessages] = React.useState<IMessage[]>([]);

  useEffect(() => {
    socket.on(
      "chat_message",
      ({ from, message }: { from: string; message: string }) => {
        const incoming: IMessage = {
          _id: Date.now(),
          text: message,
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
    console.log(newMessages);
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
