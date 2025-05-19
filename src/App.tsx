import { useEffect, useState } from "react";

import ReplyBox from "./components/Messages/ReplyBox";
import Messages from "./components/Messages";
import Users from "./components/Users";
import EmptyChat from "./components/Messages/EmptyChat";
import MessageHeader from "./components/Messages/MessageHeader";
import { fetchUserData } from "./http";

import type { ChatMessage, UserFormValues } from "./types";

import "./App.scss";

function App() {
  const [selectedUser, setSelectedUser] = useState<UserFormValues>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    async function doFetchSelectedUser() {
      if (selectedUser && selectedUser.userId) {
        try {
          const chatMessages: ChatMessage[] = await fetchUserData(
            selectedUser.userId
          );
          setMessages(chatMessages);
        } catch (error) {
          console.log("Error", error);
        }
      }
    }

    doFetchSelectedUser();
  }, [selectedUser]);

  return (
    <main className="dashboard">
      <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

      <section className="chat-area">
        {selectedUser ? (
          <>
            <MessageHeader selectedUser={selectedUser} />
            <Messages messages={messages} />
            <ReplyBox
              setMessages={setMessages}
              selectedUserId={selectedUser.userId}
            />
          </>
        ) : (
          <EmptyChat />
        )}
      </section>
    </main>
  );
}

export default App;
