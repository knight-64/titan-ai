"use client";

interface FloatingParticlesProps {
  count?: number;
}

export default function FloatingParticles({ count = 20 }: FloatingParticlesProps) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5,
          }}
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [Math.random() * 0.5, Math.random() * 0.2],
          }}
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-1 h-1 bg-accent rounded-full blur-sm"
        />
      ))}
    </div>
  );
}
