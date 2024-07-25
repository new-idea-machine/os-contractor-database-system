import React from 'react';

import { ReactComponent as IconCloseSmall } from "../assets/icons/closeSmall.svg";

function Badge({ onClose, children }) {
	const closeButtonStyle = {
		position: 'relative', 
		top: '-14px', 
		left: '-14px',
		color: 'var(--input-text-colour-border)'
	}

	return (
		<>
			<span className='badge'>
				{children}
			</span>
			{onClose && <IconCloseSmall style={closeButtonStyle} onClick={onClose} />}
		</>
	);
}

export default Badge;