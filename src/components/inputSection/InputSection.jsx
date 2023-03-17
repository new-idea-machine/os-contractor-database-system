import React from 'react';

export default function InputSection({ field, onChange, value }) {
	return (
		<>
			<label>{field?.label}</label>
			{field?.textArea === 'true' ? (
				<textarea
					name={field?.name}
					value={value}
					placeholder={field?.placeholder}
					onChange={onChange}
					aria-label={field?.label}
				/>
			) : (
				<input
					name={field?.name}
					value={value}
					placeholder={field?.placeholder}
					type={field?.type}
					onChange={onChange}
					aria-label={field?.label}
				/>
			)}
		</>
	);
}
