import React from 'react';
import Latex from './Latex';
import MollifierGraph from './MollifierGraph';
import ConvolutionDemo from './ConvolutionDemo';
import StepFunctionMollification from './StepFunctionMollification';

const MollifierStory = () => {
    return (
        <div className="container">
            <header className="mb-12 text-center">
                <h1>Mollifiers & Regularization</h1>
                <p className="text-xl text-gray-600">
                    From "Rough" to Smooth: A Visualisation of Mollifier function
                </p>
            </header>

            <section className="mb-16">
                <h2>1. The Problem: "Rough" Functions</h2>
                <div className="card">
                    <p className="mb-4">
                        In spaces like <Latex>L^p</Latex>, functions can be hard to work with. They might be discontinuous,
                        have sharp corners (like ReLU), or be undefined on sets of measure zero.
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li><strong>The Issue:</strong> Standard calculus breaks down on corners and discontinuities.</li>
                        <li><strong>The Goal:</strong> We want to prove theorems for these "rough" functions.</li>
                        <li><strong>The Strategy:</strong> Approximate rough functions with perfectly smooth ones (<Latex>C^\infty</Latex>).</li>
                    </ul>
                </div>
            </section>

            <section className="mb-16">
                <h2>2. The Tool: The Mollifier</h2>
                <div className="card">
                    <p className="mb-4">
                        The "Mollifier" (often denoted <Latex>J</Latex> or <Latex>\rho</Latex>) is a smooth "bump" function.
                        It acts as a convolution kernel.
                    </p>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Key Properties:</h3>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Smooth:</strong> <Latex>J \in C_c^\infty</Latex> (Infinite derivatives, no corners).</li>
                            <li><strong>Compact Support:</strong> Zero outside a small range (usually <Latex>[-1, 1]</Latex>).</li>
                            <li><strong>Unit Mass:</strong> <Latex>{'\\int J(x) dx = 1'}</Latex> (Acts like a weighted average).</li>
                        </ul>
                    </div>

                    <p className="mb-4">
                        We scale this bump by <Latex>\epsilon</Latex> to make it tighter and taller:
                    </p>
                    <div className="math-block text-center mb-6">
                        <Latex block>{'J_\\epsilon(x) = \\frac{1}{\\epsilon^n} J\\left(\\frac{x}{\\epsilon}\\right)'}</Latex>
                    </div>

                    <div className="visualization-container">
                        <h3 className="mb-4">Interactive Mollifier <Latex>J_\epsilon(x)</Latex></h3>
                        <MollifierGraph />
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Drag the slider to change <Latex>\epsilon</Latex>. Notice how the area stays constant (1) while the width shrinks.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-16">
                <h2>3. The Mechanism: Convolution</h2>
                <div className="card">
                    <p className="mb-4">
                        We create a "Regularized" function <Latex>f_\epsilon</Latex> by convolving our rough function <Latex>f</Latex> with the mollifier <Latex>J_\epsilon</Latex>:
                    </p>
                    <div className="math-block text-center mb-6">
                        <Latex block>{'(J_\\epsilon * f)(x) = \\int J_\\epsilon(x-y)f(y) dy'}</Latex>
                    </div>
                    <p className="mb-4">
                        <strong>The Engineering Story:</strong> Imagine <Latex>f</Latex> is a noisy signal. We slide the "bump" <Latex>J_\epsilon</Latex> across it.
                        At every point, we take a weighted average of the neighbors. This rounds off corners and smooths out noise.
                    </p>

                    <div className="visualization-container">
                        <h3 className="mb-4">Visualizing Regularization</h3>
                        <ConvolutionDemo />
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Watch how the blue "bump" slides across the rough red function.
                            The green line is the resulting smooth function.
                        </p>
                    </div>
                </div>

            </section >

            <section className="mb-16">
                <h2>Deep Dive: Concrete Example</h2>
                <div className="card">
                    <p className="mb-4">
                        Let's make this concrete. Instead of abstract formulas, let's calculate the mollification of a simple
                        <strong>Step Function</strong> using a simple <strong>Box Kernel</strong>.
                    </p>
                    <div className="mb-6">
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Rough Function <Latex>f(x)</Latex>:</strong> 1 if <Latex>x &gt; 0</Latex>, else 0.</li>
                            <li><strong>Mollifier <Latex>J_\epsilon</Latex>:</strong> A box of width <Latex>2\epsilon</Latex> and height <Latex>1/(2\epsilon)</Latex>.</li>
                        </ul>
                    </div>
                    <p className="mb-6">
                        The integral <Latex>{'f_\\epsilon(x) = \\frac{1}{2\\epsilon} \\int_{-\\epsilon}^{\\epsilon} f(x-z) dz'}</Latex> becomes an average over the window <Latex>[x-\epsilon, x+\epsilon]</Latex>.
                    </p>

                    <StepFunctionMollification />
                </div>
            </section>

            <section className="mb-16">
                <h2>4. The Payoff: Three Big Guarantees</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card bg-blue-50 border-blue-100">
                        <h3 className="text-blue-800 font-bold mb-2">1. Smoothness</h3>
                        <p className="text-sm">
                            The result <Latex>J_\epsilon * f</Latex> is <Latex>C^\infty</Latex>.
                            Derivatives move onto the smooth kernel <Latex>J</Latex>.
                        </p>
                    </div>
                    <div className="card bg-green-50 border-green-100">
                        <h3 className="text-green-800 font-bold mb-2">2. Locality</h3>
                        <p className="text-sm">
                            If <Latex>f</Latex> is zero outside a box, the result is zero outside a slightly larger box (padded by <Latex>\epsilon</Latex>).
                        </p>
                    </div>
                    <div className="card bg-purple-50 border-purple-100">
                        <h3 className="text-purple-800 font-bold mb-2">3. Convergence</h3>
                        <p className="text-sm">
                            As <Latex>\epsilon \to 0</Latex>, the smooth approximation converges to the original:
                            <Latex>{'\\|J_\\epsilon * f - f\\|_p \\to 0'}</Latex>.
                        </p>
                    </div>
                </div>
            </section>
        </div >
    );
};

export default MollifierStory;
