import React from "react";

function ResponsiveGrid({minColumnWidth, rowGap, children}) {
  const style =
    {
      display:  "grid",
      gridTemplateColumns:  `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`,
      rowGap,
      placeItems:  "center",
      minHeight:  "fit-content"
    }

  return (
    <div style={style}>
      {children}
    </div>
  )
}

export default ResponsiveGrid;