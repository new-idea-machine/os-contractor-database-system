import React from 'react';

export default function InputSection({ field, onChange, value }) {
	return (
		<>
			<label>{field?.label}</label>
			{field?.type === 'textArea' ? (
				<textarea
					name={field?.name}
					value={value}
					placeholder={field?.placeholder}
					onChange={onChange}
					aria-label={field?.label}
				/>
			) : field?.type === 'select' ? (
				<select
					name={field?.name}
					value={value}
					onChange={onChange}
					aria-label={field?.label}
				>
					{field?.options?.map((option, index) => (
						<option key={index} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			) : (
				<input
					name={field?.name}
					value={value}
					placeholder={field?.placeholder}
					type={field?.type}
					onChange={onChange}
					aria-label={field?.label}
					required
				/>
			)}
		</>
	);
}
