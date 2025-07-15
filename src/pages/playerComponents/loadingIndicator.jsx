import React from 'react'; // Don't forget to import React if you're using older versions or if your setup requires it.

import { motion } from "motion/react"; // Only include if you're actually using it in this component

function LoadingIndicator() {
    return (
        <div className="loading-container">
            <motion.div
                animate={{rotate: 360}}>
                <svg
                    width="210mm"
                    height="297mm"
                    viewBox="0 0 210 297"
                    version="1.1"
                    id="svg1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs id="defs1" />
                    <g id="layer1">
                        <path
                            style={{
                                fill: 'none',
                                stroke: '#000000',
                                strokeWidth: '5.29167',
                                strokeDasharray: 'none'
                            }}
                            id="path1"
                            d="M 137.00835,130.56242 A 36.693321,36.693321 0 0 1 105.51347,166.88564 36.693321,36.693321 0 0 1 65.094663,140.85443 36.693321,36.693321 0 0 1 85.137078,97.155396"
                        />
                    </g>
                </svg>
            </motion.div>
        </div>
    );
}

export default LoadingIndicator;