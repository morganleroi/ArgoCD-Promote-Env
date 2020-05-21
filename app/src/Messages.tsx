import React from "react";
import { Message } from "./Message";

export const Messages: React.FC<Message> = (message) => {
    if (message !== null) {
        return <p>{message.value}</p>;
    }
    return <p>RIEN</p>;
}