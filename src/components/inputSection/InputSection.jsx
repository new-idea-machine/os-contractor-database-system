import React from "react";

export default function InputSection({ field, onChange, value, onDelete }) {
  if (field?.type === "select") {
    return (
      <label style={{ gridArea: field.name }}>
        {field.label && (
          <>
            {field.label}
            <br />
          </>
        )}
        <select name={field?.name} defaultValue={value} onChange={onChange}>
          {field?.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  } else if (field?.type === "textArea") {
    return (
      <label
        style={{
          gridArea: field.name,
          display: "grid",
          gridTemplateRows: "min-content 1fr min-content",
          gridTemplateColumns: "1fr",
          width: "100%",
          height: "100%",
        }}
      >
        {field.label && <>{field.label}</>}
        <textarea
          name={field?.name}
          defaultValue={value}
          placeholder={field?.placeholder}
          onChange={onChange}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            resize: "none",
          }}
        />
        {onDelete && (
          <button type="button" onClick={onDelete}>
            X
          </button>
        )}
      </label>
    );
  } else {
    return (
      <label style={{ gridArea: field.name }}>
        {field.label && (
          <>
            {field.label}
            <br />
          </>
        )}
        <input
          name={field?.name}
          defaultValue={value}
          placeholder={field?.placeholder}
          type={field?.type}
          onChange={onChange}
        />
        {onDelete && (
          <button type="button" onClick={onDelete}>
            X
          </button>
        )}
      </label>
    );
  }
}
