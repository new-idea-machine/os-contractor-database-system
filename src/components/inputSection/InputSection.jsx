import React from 'react';

export default function InputSection({ field, onChange, value, onDelete })
{
	if (field?.type === 'select') {
		return (
			<label>
				{ field.label && <>{field.label}<br /></> }
				<select name={ field?.name } value={ value } onChange={ onChange }>
					{ field?.options?.map((option) => (
						<option key={option} value={option}>
							{ option }
						</option>
					)) }
				</select>
			</label>
		);
	} else if (field?.type === 'textArea') {
		return (
			<label>
				{ field.label && <>{field.label}<br /></> }
				<textarea
					name={field?.name}
					value={value}
					placeholder={field?.placeholder}
					onChange={onChange}
				/>
				{ onDelete && (
					<button type="button" onClick={onDelete}>
						X
					</button>
				) }
			</label>
		);
	} else {
		return (
			<label>
				{ field.label && <>{field.label}<br /></> }
				<input
					name={field?.name}
					value={value}
					placeholder={field?.placeholder}
					type={field?.type}
					onChange={onChange}
				/>
				{ onDelete && (
					<button type="button" onClick={onDelete}>
						X
					</button>
				) }
			</label>
		);
	}
}
