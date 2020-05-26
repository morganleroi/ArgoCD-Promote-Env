import React from "react";

export type Message = {
    value: string;
    type: string;
  }

export const Messages = (props: { message: Message | undefined}) => {
    if (props.message !== null) {
        return <p>{props.message?.value}</p>;
    }
    return <p>RIEN</p>;
}