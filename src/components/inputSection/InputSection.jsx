import React from 'react';

export default function InputSection({ field, onChange, value }) {
	return (
		<input
			name={field?.name}
			value={value}
			placeholder='Test'
			type={field?.type}
			onChange={onChange}
			aria-label={field?.label}
		/>
	);
}
