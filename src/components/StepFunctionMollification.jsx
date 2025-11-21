import React, { useState } from 'react';
import Latex from './Latex';

const StepFunctionMollification = () => {
    const [x, setX] = useState(0.5);
    const [epsilon, setEpsilon] = useState(0.5);

    // Constants
    // Reduced width for side-by-side layout
    const width = 350;
    const height = 250;
    const padding = 30;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    // Ranges
    const xMin = -2;
    const xMax = 2;
    const yMin = -0.2;
    const yMax = 1.2;

    const mapX = (val) => padding + ((val - xMin) / (xMax - xMin)) * plotWidth;
    const mapY = (val) => height - padding - ((val - yMin) / (yMax - yMin)) * plotHeight;

    // Step Function f(y)
    const f = (y) => (y > 0 ? 1 : 0);

    // Regularized function f_eps(x)
    const f_eps = (val) => {
        if (val < -epsilon) return 0;
        if (val > epsilon) return 1;
        return 0.5 + val / (2 * epsilon);
    };

    // Calculation Logic
    let calculationCase = '';
    let integralLatex = '';
    let resultLatex = '';

    if (x < -epsilon) {
        calculationCase = 'Case 1: Far Left (x < -ε)';
        integralLatex = '\\frac{1}{2\\epsilon} \\int_{-\\epsilon}^{\\epsilon} 0 \\, dz = 0';
        resultLatex = 'f_\\epsilon(x) = 0';
    } else if (x > epsilon) {
        calculationCase = 'Case 2: Far Right (x > ε)';
        integralLatex = '\\frac{1}{2\\epsilon} \\int_{-\\epsilon}^{\\epsilon} 1 \\, dz = 1';
        resultLatex = 'f_\\epsilon(x) = 1';
    } else {
        calculationCase = 'Case 3: The Transition (-ε ≤ x ≤ ε)';
        integralLatex = `\\frac{1}{2\\epsilon} (x+\\epsilon) = \\frac{${(x + epsilon).toFixed(2)}}{${(2 * epsilon).toFixed(2)}}`;
        resultLatex = `f_\\epsilon(x) = ${f_eps(x).toFixed(3)}`;
    }

    // Visualization Data
    const windowStart = x - epsilon;
    const windowEnd = x + epsilon;
    const overlapStart = Math.max(0, windowStart);
    const overlapEnd = Math.max(0, windowEnd);
    const hasOverlap = overlapEnd > overlapStart;

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Row 1: Graphs Side-by-Side */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>

                {/* Top Graph: The Setup */}
                <div className="bg-white p-4 rounded border border-gray-200" style={{ flex: '1 1 300px' }}>
                    <h4 className="text-lg font-semibold mb-2 text-center">1. The Setup: Window on f(y)</h4>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <svg width={width} height={height} className="overflow-visible">
                            {/* Axes */}
                            <line x1={padding} y1={mapY(0)} x2={width - padding} y2={mapY(0)} stroke="#ccc" strokeWidth="2" />
                            <line x1={mapX(0)} y1={height - padding} x2={mapX(0)} y2={padding} stroke="#ccc" strokeWidth="2" />

                            {/* Step Function f(y) */}
                            <path
                                d={`M ${mapX(xMin)} ${mapY(0)} L ${mapX(0)} ${mapY(0)} L ${mapX(0)} ${mapY(1)} L ${mapX(xMax)} ${mapY(1)}`}
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="3"
                            />
                            <text x={mapX(1.5)} y={mapY(1) - 10} fill="#ef4444" fontWeight="bold">f(y)</text>

                            {/* The Window [x-eps, x+eps] */}
                            <rect
                                x={mapX(windowStart)}
                                y={padding}
                                width={mapX(windowEnd) - mapX(windowStart)}
                                height={height - 2 * padding}
                                fill="rgba(59, 130, 246, 0.1)"
                                stroke="#3b82f6"
                                strokeDasharray="4"
                            />

                            {/* Overlap Area (Integral) */}
                            {hasOverlap && (
                                <rect
                                    x={mapX(overlapStart)}
                                    y={mapY(1)}
                                    width={mapX(overlapEnd) - mapX(overlapStart)}
                                    height={mapY(0) - mapY(1)}
                                    fill="rgba(16, 185, 129, 0.3)"
                                    stroke="none"
                                />
                            )}
                        </svg>
                    </div>
                </div>

                {/* Bottom Graph: The Result */}
                <div className="bg-white p-4 rounded border border-gray-200" style={{ flex: '1 1 300px' }}>
                    <h4 className="text-lg font-semibold mb-2 text-center">2. The Result: f_ε(x)</h4>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <svg width={width} height={height} className="overflow-visible">
                            {/* Axes */}
                            <line x1={padding} y1={mapY(0)} x2={width - padding} y2={mapY(0)} stroke="#ccc" strokeWidth="2" />
                            <line x1={mapX(0)} y1={height - padding} x2={mapX(0)} y2={padding} stroke="#ccc" strokeWidth="2" />

                            {/* Result Curve */}
                            <path
                                d={`
                   M ${mapX(xMin)} ${mapY(0)} 
                   L ${mapX(-epsilon)} ${mapY(0)} 
                   L ${mapX(epsilon)} ${mapY(1)} 
                   L ${mapX(xMax)} ${mapY(1)}
                 `}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                            />

                            {/* Current Point */}
                            <circle cx={mapX(x)} cy={mapY(f_eps(x))} r="6" fill="#10b981" stroke="white" strokeWidth="2" />
                            <line x1={mapX(x)} y1={mapY(0)} x2={mapX(x)} y2={mapY(f_eps(x))} stroke="#10b981" strokeDasharray="4" />
                            <text x={mapX(x)} y={mapY(0) + 20} textAnchor="middle" fontSize="12" fill="#10b981">x</text>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Row 2: Controls and Calculations */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

                {/* Controls Column */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
                    <h4 className="font-bold text-gray-700">Controls</h4>
                    <label className="flex items-center gap-4">
                        <span className="w-24 font-semibold">Position x:</span>
                        <input
                            type="range"
                            min={xMin}
                            max={xMax}
                            step="0.01"
                            value={x}
                            onChange={(e) => setX(parseFloat(e.target.value))}
                            style={{ flex: 1 }}
                        />
                        <span className="font-mono w-12">{x.toFixed(2)}</span>
                    </label>
                    <label className="flex items-center gap-4">
                        <span className="w-24 font-semibold">Width ε:</span>
                        <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={epsilon}
                            onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                            style={{ flex: 1 }}
                        />
                        <span className="font-mono w-12">{epsilon.toFixed(2)}</span>
                    </label>
                </div>

                {/* Calculations Column */}
                <div style={{ flex: '1 1 300px', borderLeft: '1px solid #e5e7eb', paddingLeft: '2rem' }}>
                    <h4 className="text-xl font-bold mb-4 text-gray-800">{calculationCase}</h4>
                    <p className="mb-2 text-gray-600">Integral Calculation:</p>
                    <div className="text-lg">
                        <Latex block>{integralLatex}</Latex>
                        <Latex block>{resultLatex}</Latex>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StepFunctionMollification;
