import React from 'react';

export default function InputSection({ field, onChange, value }) {
	return (
		<>
			<label>{field?.label}</label>
			<input
				name={field?.name}
				value={value}
				placeholder={field?.placeholder}
				type={field?.type}
				onChange={onChange}
				aria-label={field?.label}
			/>
		</>
	);
}
