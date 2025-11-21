import React, { useState, useMemo, useEffect } from 'react';
import Latex from './Latex';

const ConvolutionDemo = () => {
    const [t, setT] = useState(-2.5); // Current position of the kernel center
    const [epsilon, setEpsilon] = useState(0.3);
    const [isPlaying, setIsPlaying] = useState(false);

    // Constants
    const width = 700;
    const height = 400;
    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    const xMin = -3;
    const xMax = 3;
    const yMin = -0.5;
    const yMax = 2.5;

    const mapX = (x) => padding + ((x - xMin) / (xMax - xMin)) * plotWidth;
    const mapY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * plotHeight;

    // Math functions
    const k = 2.252283621;
    const J = (x) => (Math.abs(x) >= 1 ? 0 : k * Math.exp(-1 / (1 - x * x)));
    const J_eps = (x, eps) => (1 / eps) * J(x / eps);

    // The "Rough" Function f(x)
    // Let's make it a "noisy box" with discontinuities
    const f = (x) => {
        if (x < -1 || x > 1) return 0;
        // Add some "noise" and corners
        return 1 + 0.3 * Math.sin(10 * x) + 0.1 * Math.cos(25 * x);
    };

    // Pre-calculate data
    const steps = 400;
    const dx = (xMax - xMin) / steps;

    const data = useMemo(() => {
        const fPoints = [];
        const convPoints = [];

        // Calculate f(x) and convolution (J_eps * f)(x) for all x
        for (let i = 0; i <= steps; i++) {
            const x = xMin + i * dx;
            fPoints.push({ x, y: f(x) });

            // Numerical convolution at x
            // Integral J_eps(x - y) * f(y) dy
            // We integrate over the support of J_eps(x-y), which is [x-eps, x+eps]
            // Or just integrate over the support of f [-1, 1] since f is 0 elsewhere
            // Let's integrate over [-1, 1] for simplicity as f is 0 outside
            let sum = 0;
            const intSteps = 100; // Integration steps
            const intStart = -1.2; // Slightly wider than support of f
            const intEnd = 1.2;
            const intDx = (intEnd - intStart) / intSteps;

            for (let j = 0; j < intSteps; j++) {
                const y = intStart + j * intDx;
                sum += J_eps(x - y, epsilon) * f(y) * intDx;
            }
            convPoints.push({ x, y: sum });
        }
        return { fPoints, convPoints };
    }, [epsilon]);

    // Animation loop
    useEffect(() => {
        let animationFrame;
        if (isPlaying) {
            const animate = () => {
                setT(prev => {
                    if (prev >= xMax) {
                        setIsPlaying(false);
                        return xMax;
                    }
                    return prev + 0.02;
                });
                animationFrame = requestAnimationFrame(animate);
            };
            animationFrame = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(animationFrame);
    }, [isPlaying]);

    // Path generators
    const generatePath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p.x)} ${mapY(p.y)}`).join(' ');

    const fPath = generatePath(data.fPoints);

    // Convolution path only up to current t
    const convPathFull = generatePath(data.convPoints);
    // Find index for t
    const tIndex = Math.floor((t - xMin) / dx);
    const convPathProgress = generatePath(data.convPoints.slice(0, Math.max(1, tIndex + 1)));

    // Kernel at current t: J_eps(t - x)
    // Note: Convolution definition is integral J(x-y)f(y) dy.
    // Visually, we usually show J(x-y) as a function of y.
    // It is J centered at x, flipped? J is symmetric so flip doesn't matter.
    // So we plot y -> J_eps(t - y).
    const kernelPoints = [];
    for (let i = 0; i <= steps; i++) {
        const x = xMin + i * dx; // this is 'y' in the integral
        const yVal = J_eps(t - x, epsilon);
        // Scale it down or up? 
        // The kernel height can be large (1/eps). 
        // Let's plot it as is, but maybe transparent filled area.
        if (yVal > 0.01) kernelPoints.push({ x, y: yVal });
    }
    // Close the kernel shape for filling
    const kernelPath = kernelPoints.length > 0
        ? `M ${mapX(kernelPoints[0].x)} ${mapY(0)} ` +
        kernelPoints.map(p => `L ${mapX(p.x)} ${mapY(p.y)}`).join(' ') +
        ` L ${mapX(kernelPoints[kernelPoints.length - 1].x)} ${mapY(0)} Z`
        : '';

    return (
        <div className="w-full flex flex-col items-center">
            <svg width={width} height={height} className="border border-gray-100 bg-white rounded overflow-hidden">
                {/* Axes */}
                <line x1={padding} y1={mapY(0)} x2={width - padding} y2={mapY(0)} stroke="#ccc" strokeWidth="2" />
                <line x1={mapX(0)} y1={height - padding} x2={mapX(0)} y2={padding} stroke="#ccc" strokeWidth="2" />

                {/* Legend */}
                <g transform={`translate(${width - 150}, 30)`}>
                    <rect x="0" y="0" width="120" height="80" fill="white" stroke="#eee" rx="4" />
                    <line x1="10" y1="20" x2="40" y2="20" stroke="#ef4444" strokeWidth="2" />
                    <text x="50" y="24" fontSize="12">Rough f(x)</text>

                    <rect x="10" y="35" width="30" height="10" fill="rgba(59, 130, 246, 0.3)" />
                    <text x="50" y="44" fontSize="12">Kernel J(t-y)</text>

                    <line x1="10" y1="60" x2="40" y2="60" stroke="#10b981" strokeWidth="3" />
                    <text x="50" y="64" fontSize="12">Result (J*f)(t)</text>
                </g>

                {/* Rough Function f(x) */}
                <path d={fPath} fill="none" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.5" />

                {/* Kernel (Sliding Window) */}
                <path d={kernelPath} fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="1" />

                {/* Resulting Convolution Curve (Progressive) */}
                <path d={convPathProgress} fill="none" stroke="#10b981" strokeWidth="3" />

                {/* Current Point Indicator */}
                {tIndex >= 0 && tIndex < data.convPoints.length && (
                    <circle
                        cx={mapX(t)}
                        cy={mapY(data.convPoints[tIndex].y)}
                        r="5"
                        fill="#10b981"
                        stroke="white"
                        strokeWidth="2"
                    />
                )}

                {/* Vertical line at t */}
                <line x1={mapX(t)} y1={padding} x2={mapX(t)} y2={height - padding} stroke="#666" strokeDasharray="4" strokeOpacity="0.5" />
                <text x={mapX(t)} y={height - 10} textAnchor="middle" fontSize="12">t</text>

            </svg>

            <div className="controls mt-4" style={{ display: 'flex', flexDirection: 'row', gap: '4rem', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                {/* Left Column: Toggles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', left: '0', gap: '0.5rem' }}>
                        <span style={{ width: '120px', textAlign: 'right', fontWeight: '500' }}>Position t:</span>
                        <input
                            type="range"
                            min={xMin}
                            max={xMax}
                            step="0.01"
                            value={t}
                            onChange={(e) => { setIsPlaying(false); setT(parseFloat(e.target.value)); }}
                        />
                        <span className="font-mono w-12">{t.toFixed(2)}</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ width: '120px', textAlign: 'right', fontWeight: '500' }}>Kernel Width ε:</span>
                        <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={epsilon}
                            onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                        />
                        <span className="font-mono w-12">{epsilon.toFixed(2)}</span>
                    </label>
                </div>

                {/* Right Column: Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: '160px' }}>
                        {isPlaying ? 'Pause' : 'Play Animation'}
                    </button>
                    <button onClick={() => { setIsPlaying(false); setT(xMin); }} style={{ width: '160px' }}>
                        Reset
                    </button>
                </div>
            </div>
        </div>

    );
};

export default ConvolutionDemo;
