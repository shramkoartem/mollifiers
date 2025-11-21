# Mollifiers & Regularization Visualization

An interactive React application visualizing the mathematical concept of **Mollifiers** and **Regularization**. This tool helps bridge the gap between abstract functional analysis concepts and concrete visual intuition.

🔗 **[Live Demo](https://shramkoartem.github.io/mollifiers/)**

## The Theory: From "Rough" to Smooth

In advanced calculus and functional analysis (e.g., Sobolev spaces), we often deal with "rough" functions—functions that might be discontinuous, have sharp corners, or be non-differentiable. Standard calculus tools break down on these functions.

**Mollification** is a technique to approximate these rough functions with perfectly smooth ($C^\infty$) functions while preserving their essential shape.

### What is a Mollifier?
A standard mollifier (often denoted $J_\epsilon$ or $\rho_\epsilon$) is a smooth "bump" function that acts as a weighted average kernel. It has three key properties:

1.  **Smoothness**: $J \in C_c^\infty(\mathbb{R}^n)$. It has derivatives of all orders.
2.  **Compact Support**: It is zero outside a small ball of radius $\epsilon$. It only "looks" at local information.
3.  **Unit Mass**: $\int J_\epsilon(x) dx = 1$. This ensures it preserves the total integral of the function it modifies.

### The Mechanism: Convolution
We create a smooth approximation $f_\epsilon$ of a rough function $f$ by **convolution**:

$$f_\epsilon(x) = (J_\epsilon * f)(x) = \int_{\mathbb{R}^n} J_\epsilon(x-y) f(y) dy$$

Intuitively, this slides the smooth "bump" $J_\epsilon$ across $f$. At each point $x$, the value $f_\epsilon(x)$ is a weighted average of the values of $f$ near $x$. This averaging process smooths out sharp corners and jumps.

## Key Properties

The resulting family of functions $\{f_\epsilon\}_{\epsilon>0}$ gives us powerful guarantees:

*   **Smoothness**: The result $f_\epsilon$ is infinitely differentiable ($C^\infty$), even if $f$ was discontinuous.
*   **Convergence**: As $\epsilon \to 0$, the approximation converges to the original function in $L^p$ norm: $\|f_\epsilon - f\|_p \to 0$ (for $1 \le p < \infty$).
*   **Locality**: If $f$ has compact support, $f_\epsilon$ also has compact support (slightly larger by $\epsilon$).

## What This Repository Shows

This application provides three interactive visualizations to demonstrate these concepts:

1.  **The Mollifier Kernel**:
    *   Visualize the shape of the bump function $J_\epsilon(x)$.
    *   Adjust $\epsilon$ to see how the kernel becomes "taller and thinner" (approaching a Dirac delta) while maintaining unit area.

2.  **Convolution Animation**:
    *   Watch the regularization process in action.
    *   A "rough" function (red) is convolved with a sliding kernel (blue).
    *   The resulting smooth function (green) is drawn in real-time.

3.  **Concrete Step Function Example**:
    *   A "Deep Dive" into the explicit calculation.
    *   See exactly how a discontinuous **Step Function** is transformed into a linear ramp using a simple **Box Kernel**.
    *   Includes step-by-step integral calculations for different regions (Case 1, 2, 3).

## Running Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/shramkoartem/mollifiers.git
    cd mollifiers
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

## Tech Stack
*   **React** (Vite)
*   **KaTeX** for mathematical rendering
*   **SVG** for custom interactive plotting
*   **GitHub Actions** for automated deployment
