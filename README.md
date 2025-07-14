# lobby-chat-client

## Architecture Diagram
<img width="693" height="422" alt="Ideatrix Game Lobby drawio" src="https://github.com/user-attachments/assets/17ab6ced-25ce-4e30-989e-d3c7789faa0b" />

## Build Instructions
1. Clone this repository and cd into LobbyChatClient with a terminal.
2. Run `npm install` to install all the necessary packages.
3. Install Android Studio by following the instructions in this <a href="https://developer.android.com/studio/install">link</a>.
4. Setup expo environment by following the steps in this <a href="https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=physical&mode=development-build&buildEnv=local">link</a>.
5. Run `adb reverse tcp:3000 tcp:3000` to make sure that the the apk's network can reach the backend server running at `https://localhost:3000`.
6. Run `npm run android` to build and start the development server.

## Tech Stack
### Frontend
1. React Native
2. Expo
3. Node JS
4. TypeScript

### Backend
1. Socket IO
2. Express JS
3. OpenAI
4. Node JS

## Prompt Strategy
For the AI bots, each bot is built to have different characteristics. Currently I have a sarcastic bot and a curious bot which responds to user's prompts based on the characteristics.
Currently, rate limit is not handled. I have plans to add it to future work.

## Known Limitations and Future Work
1. Rate limit handling is not implemented yet as mentioned before.
2. Lobbies that gets created are not properly destroyed after all the users leaves.
3. User icons on chats are rendered on the go instead of using icon images.
4. Lobby and chat data are not saved securely on a database. Future work would include adding persistence.
5. Streaming AI responses.
6. Adding and displaying user names.
7. Using chat history for better AI prompting.
8. Handling AI in the front-end to prevent privacy concerns on the back-end.
9. Better UX and design.
10. Add more AI with characters and allow users the ability to choose AI characteristics.
