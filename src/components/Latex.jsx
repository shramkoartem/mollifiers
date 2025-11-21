import React, { useEffect, useRef } from 'react';
import katex from 'katex';

const Latex = ({ children, block = false }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            katex.render(children, containerRef.current, {
                throwOnError: false,
                displayMode: block,
            });
        }
    }, [children, block]);

    return <span ref={containerRef} />;
};

export default Latex;
