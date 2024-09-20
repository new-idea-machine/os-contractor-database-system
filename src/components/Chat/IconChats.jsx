import React, { useContext } from "react";
import { messagesContext } from "../../contexts/MessagesContext";

import styles from "./IconChats.module.css";

import { ReactComponent as Icon } from '../../assets/icons/chats.svg';

function IconChat() {
	const { getNumUnreadMessages } = useContext(messagesContext);
	const numUnreadMessages = getNumUnreadMessages();

	return (
		<div className={styles.IconChat}>
			<Icon />
			{numUnreadMessages > 0 &&
				<span>
					{numUnreadMessages > 99 ? "++" : `${numUnreadMessages}`}
				</span>
			}
		</div>
	)
}

export default IconChat;