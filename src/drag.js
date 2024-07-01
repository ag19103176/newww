import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
// import "./styles.css";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function DragFromOutsideLayout() {
  const [compactType, setCompactType] = useState("vertical");
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onCompactTypeChange = () => {
    const oldCompactType = compactType;
    const newCompactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";
    setCompactType(newCompactType);
  };

  const onDrop = (elemParams) => {
    alert(
      `Element parameters:\n${JSON.stringify(elemParams, ["x", "y", "w", "h"])}`
    );
  };

  const addBox = () => {
    const newItem = {
      i: `n${layout.length}`, // Unique id based on the current length
      x: (layout.length % 4) * 1, // Position in the next column, wrap every 3 columns
      y: Math.floor(layout.length / 3) * 2, // Move to the next row after 3 items
      w: 1, // Width of the item
      h: 2, // Height of the item
    };
    setLayout([...layout, newItem]);
  };

  return (
    <div>
      <button onClick={addBox}>Add Box</button>
      <ResponsiveReactGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        onDrop={onDrop}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        compactType={compactType}
        preventCollision={!compactType}
        isDroppable={true}
        droppingItem={{ i: "xx", h: 50, w: 250 }}
      >
        {layout.map((itm) => (
          <div key={itm.i} data-grid={itm} className="block">
            {itm.i}
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
}
