import CloseIcon from "@mui/icons-material/Close";
import "./ClearSkill.css"

export default function ClearSkill({ skill, onRemove }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "5px", marginRight: "8px", borderStyle: "solid",
    borderColor: "#F2F1F1",
    borderWidth: "0.5px",
    borderRadius: "5px", padding: "3px", backgroundColor: "#F2F1F1"}}>
      <span>{skill}</span>
      <CloseIcon
      className="close_icon"
               onClick={() => onRemove(skill)}
      />
    </div>
  );
}
