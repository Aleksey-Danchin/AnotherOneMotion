import React, { createRef } from "react";

const ref = createRef<SVGCircleElement>();

const c = <circle ref={ref} x={0} />;

console.log(ref);
