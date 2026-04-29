import { useEffect, useRef } from 'react';

const AppleGlow = ({ borderWidth = 2, speed = 3 }) => {
  const ref = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const draw = (t) => {
      const angle = (t * 0.001 * speed * 36) % 360;
      el.style.backgroundImage = `conic-gradient(from ${angle}deg, #ff6b35, #ff2d55, #af52de, #5856d6, #007aff, #5ac8fa, #34c759, #ffcc00, #ff9500, #ff6b35)`;
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [speed]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none z-[1]"
      style={{
        padding: `${borderWidth}px`,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
      }}
    />
  );
};

export default AppleGlow;
