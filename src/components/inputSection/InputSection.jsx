import React from 'react';

export default function InputSection({ field, onChange, value }) {
	return (
		<>
			<label>{field?.label}</label>
			{field?.type === 'textArea' && field?.name !== 'availabilityDetails'? (
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
					<option key={index} value={option}>
					  {option}
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
					required ={field?.name !== 'linkedinUrl' && field?.name !== 'githubUrl'} 
				/>
			)}
				{field?.name === 'availability' && value === 'Other' && (
        		// Render additional text area for 'Other' option
        		<textarea
          			name= 'availabilityDetails'
          			//value={value}
          			placeholder='Please provide more info'
          			onChange={onChange}
          			aria-label= 'Availability details'
        />
      )}
		</>
	);
}
