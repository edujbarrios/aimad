import { useEffect, useRef } from 'react';
import styles from './AssistantAvatar.module.css';

interface AssistantAvatarProps {
  active?: boolean;
  speaking?: boolean;
  status?: 'idle' | 'thinking' | 'speaking' | 'listening';
}

export default function AssistantAvatar({
  active = false,
  speaking = false,
  status = 'idle',
}: AssistantAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      phaseRef.current += speaking ? 0.06 : active ? 0.025 : 0.01;
      const phase = phaseRef.current;

      const rings = [
        { r: 80, width: 1.5, alpha: 0.25, speed: 0.8 },
        { r: 65, width: 1, alpha: 0.35, speed: 1.2 },
        { r: 50, width: 2, alpha: 0.5, speed: 0.6 },
        { r: 35, width: 1.5, alpha: 0.7, speed: 1.5 },
      ];

      // outer glow halo
      const haloGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 90);
      haloGrad.addColorStop(0, `rgba(0, 255, 255, ${speaking ? 0.12 : 0.05})`);
      haloGrad.addColorStop(1, 'rgba(0,255,255,0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.fill();

      // draw animated rings
      rings.forEach(({ r, width, alpha, speed }) => {
        const pulse = Math.sin(phase * speed) * (speaking ? 5 : active ? 3 : 1);
        ctx.beginPath();
        ctx.arc(cx, cy, r + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.lineWidth = width;
        ctx.stroke();
      });

      // rotating arc segments
      const numSegments = speaking ? 12 : 8;
      for (let i = 0; i < numSegments; i++) {
        const angle = (i / numSegments) * Math.PI * 2 + phase * 0.4;
        const segLen = speaking
          ? (0.15 + 0.1 * Math.sin(phase * 2 + i)) * Math.PI
          : 0.1 * Math.PI;
        ctx.beginPath();
        ctx.arc(cx, cy, 58, angle, angle + segLen);
        ctx.strokeStyle = speaking
          ? `rgba(255, 0, 255, ${0.4 + 0.3 * Math.sin(phase + i)})`
          : `rgba(0, 255, 255, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // inner core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
      if (status === 'thinking') {
        coreGrad.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
        coreGrad.addColorStop(1, 'rgba(255, 140, 0, 0.1)');
      } else if (speaking) {
        coreGrad.addColorStop(0, 'rgba(255, 0, 255, 0.9)');
        coreGrad.addColorStop(1, 'rgba(255, 0, 255, 0.1)');
      } else if (active) {
        coreGrad.addColorStop(0, 'rgba(0, 255, 255, 1)');
        coreGrad.addColorStop(1, 'rgba(0, 255, 255, 0.1)');
      } else {
        coreGrad.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
        coreGrad.addColorStop(1, 'rgba(0, 255, 255, 0.0)');
      }
      ctx.beginPath();
      ctx.arc(cx, cy, 20 + Math.sin(phase * 2) * (speaking ? 4 : 1), 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // crosshair lines
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(phase * 0.2);
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(25, 0);
        ctx.lineTo(75, 0);
        ctx.stroke();
      }
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [active, speaking, status]);

  const statusLabel: Record<string, string> = {
    idle: 'STANDBY',
    thinking: 'PROCESSING',
    speaking: 'OUTPUT',
    listening: 'LISTENING',
  };

  return (
    <div className={styles.wrapper}>
      <canvas
        ref={canvasRef}
        width={180}
        height={180}
        className={`${styles.canvas} ${active ? styles.active : ''}`}
      />
      <div className={`${styles.statusLabel} ${styles[status]}`}>
        {statusLabel[status]}
      </div>
    </div>
  );
}
