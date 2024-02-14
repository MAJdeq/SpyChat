import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import MessageComponent from "./Messages";
import CryptoJS, { enc } from "crypto-js";

// 144.39.198.208
function App() {
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [clicked, isClicked] = useState(false);

  useEffect(() => {
    const s = io();
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const callback = (username) => {
      setUsername(username);
    };

    const handleUpdateMessages = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("new state", callback);
    socket.on("updateMessages", handleUpdateMessages);

    return () => {
      socket.off("new state", callback);
      socket.off("updateMessages", handleUpdateMessages);
    };
  }, [socket, username]);

  const handleGoClick = () => {
    if (username.trim() !== "") {
      isClicked((prevClicked) => !prevClicked);
      socket.emit("new state", { username });
    } else {
      document.getElementById("usernameWarningNoti").innerText =
        "Username must be filled";
      setTimeout(() => {
        document.getElementById("usernameWarningNoti").innerText = "";
      }, "2500");
    }
  };

  const handleSubmit = () => {
    if (message.trim() !== "" && password.trim() !== "") {
      const newMessage = {
        username: username,
        message: message,
        password: password,
      };
      socket.emit("new message", newMessage);
      setMessage("");
      setPassword("");
    } else {
      document.getElementById("warningNoti").innerText =
        "Both message and password must be filled";
      setTimeout(() => {
        document.getElementById("warningNoti").innerText = "";
      }, "2500");
    }
  };

  return clicked ? (
    <>
      <div className="chatWindow">
        {messages.map((message, index) => (
          <MessageComponent key={index} message={message} />
        ))}
      </div>
      <div className="inputs">
        <input
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Message"
          value={message}
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          placeholder="Password"
          value={password}
        />
        <button onClick={handleSubmit}>Post</button>
        <p id="warningNoti"></p>
      </div>
    </>
  ) : (
    <>
      <h1>WELCOME TO SPYCHAT</h1>
      <input
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder="Username"
        value={username}
      />
      <button onClick={handleGoClick}> GO </button>
      <p id="usernameWarningNoti"></p>
    </>
  );
}

export default App;
