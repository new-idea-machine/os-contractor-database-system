import React from "react";

function ResponsiveGrid({minColumnWidth, rowGap, columnGap, children}) {
  const style =
    {
      display:  "grid",
      gridTemplateColumns:  `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`,
      rowGap,
      columnGap,
      placeItems:  "center",
      minHeight:  "fit-content",
      justifyContent:  "space-between"
    }

  return (
    <div style={style}>
      {children}
    </div>
  )
}

export default ResponsiveGrid;