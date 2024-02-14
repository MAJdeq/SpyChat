import CryptoJS from "crypto-js";
import { useState } from "react";

export default function MessageComponent({ message }) {
  const [decryptPassword, setDecryptPassword] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [deciphered, setDeciphered] = useState(false);
  const [editing, setEditing] = useState(false);

  const decipher = () => {
    // Check if the entered password matches the stored hashed password

    if (message.password === decryptPassword) {
      var encrypted = CryptoJS.Rabbit.encrypt(
        message.message,
        message.password
      ).toString();
      var decrypted = CryptoJS.Rabbit.decrypt(
        encrypted,
        decryptPassword
      ).toString(CryptoJS.enc.Utf8);
      setDeciphered((prevDeciphered) => !prevDeciphered);
      setDecryptedMessage(decrypted);
    } else {
      document.getElementById("passwordNoti").innerText = "Incorrect Password";
      setTimeout(() => {
        document.getElementById("passwordNoti").innerText = "";
      }, "2500");
    }
  };

  return (
    <div className="message">
      {message.username}:{" "}
      {deciphered ? (
        decryptedMessage
      ) : (
        <>
          {editing ? (
            <>
              <input
                type="password"
                value={decryptPassword}
                onChange={(e) => setDecryptPassword(e.target.value)}
                key="decrypt-input"
              />
              <button onClick={() => decipher()}>GO</button>
              <button
                className="backButton"
                onClick={() => setEditing((prevEditing) => !prevEditing)}
              >
                {" "}
                BACK{" "}
              </button>
              <p id="passwordNoti"></p>
            </>
          ) : (
            <button onClick={() => setEditing(!editing)}>
              Decrypt Message
            </button>
          )}
        </>
      )}
    </div>
  );
}
