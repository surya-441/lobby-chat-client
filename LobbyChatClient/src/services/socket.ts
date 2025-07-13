import { io, Socket } from "socket.io-client";

export interface ServerToClientEvents {
    connect: () => void;
    disconnect: () => void;
    lobby_created: (data: { lobbyId: string }) => void;
    lobby_joined: (data: { lobbyId: string; participants: string[] }) => void;
    chat_message: (data: { from: string; text: string }) => void;
    participant_left: (data: { leavingParticipant: string }) => void;
}

export interface ClientToServerEvents {
    create_lobby: (
        maxPlayers: number,
        callback: (response: { error?: string; lobbyId?: string }) => void
    ) => void;
    join_lobby: (
        data: { lobbyId: string },
        callback: (response: {
            error?: string;
            lobbyId?: string;
            participants?: string[];
        }) => void
    ) => void;
    chat_message: (data: { lobbyId: string; text: string }) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    "http://localhost:3000/game",
    {
        transports: ["websocket"],
    }
);
