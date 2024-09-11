import React, { useContext } from "react";
import { messagesContext } from "../../contexts/MessagesContext";

import styles from "./IconChats.module.css";

import { ReactComponent as Icon } from '../../assets/icons/chats.svg';

function IconChat() {
	const { unreadMessages } = useContext(messagesContext);

	return (
		<div className={styles.IconChat}>
			<Icon />
			{unreadMessages > 0 &&
				<span>
					{unreadMessages > 99 ? "++" : `${unreadMessages}`}
				</span>
			}
		</div>
	)
}

export default IconChat;