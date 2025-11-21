import React, { useState, useMemo } from 'react';
import Latex from './Latex';

const MollifierGraph = () => {
    const [epsilon, setEpsilon] = useState(0.5);

    // Constants for SVG
    const width = 600;
    const height = 300;
    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    // Math constants
    const k = 2.252283621; // Normalization constant approx

    // The standard mollifier function J(x)
    const J = (x) => {
        if (Math.abs(x) >= 1) return 0;
        return k * Math.exp(-1 / (1 - x * x));
    };

    // The scaled mollifier J_epsilon(x)
    const J_eps = (x, eps) => {
        return (1 / eps) * J(x / eps);
    };

    // Generate points for the path
    const points = useMemo(() => {
        const pts = [];
        // X range from -2 to 2 to show context
        const xMin = -2;
        const xMax = 2;
        const steps = 200;

        for (let i = 0; i <= steps; i++) {
            const x = xMin + (i / steps) * (xMax - xMin);
            const y = J_eps(x, epsilon);
            pts.push({ x, y });
        }
        return pts;
    }, [epsilon]);

    // Scales for plotting
    // Y scale needs to adapt to epsilon since height grows as 1/epsilon
    // Max height at epsilon=0.1 is ~22. Let's fix max Y to be reasonable but allow growth.
    // Actually, let's keep Y scale fixed to show it growing out of view or clamp it?
    // Better: dynamic Y scale but with a minimum to show the shape change.
    // Let's fix Y max to something like 5 for epsilon=0.5 (height ~4.5).
    // At epsilon=1, height ~2.25.
    // At epsilon=0.2, height ~11.
    // Let's set yMax to 12 to accommodate small epsilons without clipping too much, 
    // or let it clip if it gets huge.
    const xMin = -2;
    const xMax = 2;
    const yMin = 0;
    const yMax = 6;

    const mapX = (x) => padding + ((x - xMin) / (xMax - xMin)) * plotWidth;
    const mapY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * plotHeight;

    const pathData = points.map((p, i) =>
        `${i === 0 ? 'M' : 'L'} ${mapX(p.x)} ${mapY(p.y)}`
    ).join(' ');

    return (
        <div className="w-full flex flex-col items-center">
            <svg width={width} height={height} className="border border-gray-100 bg-white rounded">
                {/* Axes */}
                <line x1={padding} y1={mapY(0)} x2={width - padding} y2={mapY(0)} stroke="#ccc" strokeWidth="2" />
                <line x1={mapX(0)} y1={height - padding} x2={mapX(0)} y2={padding} stroke="#ccc" strokeWidth="2" />

                {/* Ticks */}
                {[-1, 1].map(val => (
                    <g key={val}>
                        <line x1={mapX(val)} y1={mapY(0) - 5} x2={mapX(val)} y2={mapY(0) + 5} stroke="#999" />
                        <text x={mapX(val)} y={mapY(0) + 20} textAnchor="middle" fontSize="12" fill="#666">{val}</text>
                    </g>
                ))}

                {/* Epsilon indicators */}
                <line x1={mapX(-epsilon)} y1={mapY(0)} x2={mapX(-epsilon)} y2={mapY(0) - 10} stroke="red" strokeWidth="1" strokeDasharray="4" />
                <line x1={mapX(epsilon)} y1={mapY(0)} x2={mapX(epsilon)} y2={mapY(0) - 10} stroke="red" strokeWidth="1" strokeDasharray="4" />
                <text x={mapX(epsilon)} y={mapY(0) - 15} textAnchor="middle" fontSize="12" fill="red">ε</text>

                {/* Graph */}
                <path d={pathData} fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="3" />
            </svg>

            <div className="controls mt-4">
                <label className="flex items-center gap-4">
                    <span className="font-mono">ε = {epsilon.toFixed(2)}</span>
                    <input
                        type="range"
                        min="0.2"
                        max="1.5"
                        step="0.01"
                        value={epsilon}
                        onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                    />
                </label>
            </div>
        </div>
    );
};

export default MollifierGraph;
