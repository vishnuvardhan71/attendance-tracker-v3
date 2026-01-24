import React, { useRef, useEffect } from 'react';

const DotGrid = ({
    dotSize = 3,
    gap = 30,
    baseColor = "#1a1a2e",
    activeColor = "#ffffff",
    proximity = 100,
    speedTrigger = 150,
    shockRadius = 200,
    shockStrength = 3,
    maxSpeed = 5000,
    resistance = 900,
    returnDuration = 2
}) => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0 });
    const dotsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initDots();
        };

        const initDots = () => {
            const dots = [];
            const rows = Math.ceil(canvas.height / gap);
            const cols = Math.ceil(canvas.width / gap);

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    dots.push({
                        x: j * gap + gap / 2,
                        y: i * gap + gap / 2,
                        baseX: j * gap + gap / 2,
                        baseY: i * gap + gap / 2,
                        vx: 0,
                        vy: 0,
                    });
                }
            }
            dotsRef.current = dots;
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const dx = x - mouseRef.current.x;
            const dy = y - mouseRef.current.y;

            mouseRef.current = { x, y, vx: dx, vy: dy };
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { x: mx, y: my, vx: mvx, vy: mvy } = mouseRef.current;
            const mouseSpeed = Math.sqrt(mvx * mvx + mvy * mvy);

            dotsRef.current.forEach((dot) => {
                const dx = dot.x - mx;
                const dy = dot.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Movement logic
                if (dist < proximity) {
                    const force = (proximity - dist) / proximity;
                    dot.vx += dx * force * 0.1;
                    dot.vy += dy * force * 0.1;
                }

                // Shockwave effect
                if (mouseSpeed > speedTrigger && dist < shockRadius) {
                    const shockForce = (shockRadius - dist) / shockRadius;
                    dot.vx += mvx * shockForce * shockStrength * 0.01;
                    dot.vy += mvy * shockForce * shockStrength * 0.01;
                }

                // Return to base position
                const returnDx = dot.baseX - dot.x;
                const returnDy = dot.baseY - dot.y;
                dot.vx += returnDx / (returnDuration * 60);
                dot.vy += returnDy / (returnDuration * 60);

                // Resistance
                dot.vx *= (1 - 1 / resistance);
                dot.vy *= (1 - 1 / resistance);

                // Update position
                dot.x += dot.vx;
                dot.y += dot.vy;

                // Draw dot
                const colorIntensity = Math.min(1, Math.max(0, 1 - dist / proximity));
                ctx.fillStyle = colorIntensity > 0.1 ? activeColor : baseColor;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dotSize / 2, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [dotSize, gap, baseColor, activeColor, proximity, speedTrigger, shockRadius, shockStrength, maxSpeed, resistance, returnDuration]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
            }}
        />
    );
};

export default DotGrid;
