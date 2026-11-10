import React from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  isBuffering: boolean;
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  isBuffering,
  barCount = 28,
}) => {
  // Height factors for varied organic look
  const heights = [
    35, 65, 80, 45, 90, 70, 85, 40, 95, 60, 75, 50, 88, 62, 78, 92, 55, 82, 48,
    68, 85, 42, 74, 90, 60, 80, 52, 70,
  ];

  return (
    <div
      className="w-full h-14 flex items-end justify-center gap-1 sm:gap-1.5 px-4 py-2 bg-black/40 rounded-xl border border-amber-900/20 overflow-hidden"
      aria-label="Equalizador visual da rádio"
    >
      {Array.from({ length: barCount }).map((_, i) => {
        const heightPercent = heights[i % heights.length];
        const animationDelay = `${(i * 0.05).toFixed(2)}s`;
        const animationDuration = `${(0.6 + (i % 5) * 0.15).toFixed(2)}s`;

        return (
          <div
            key={i}
            className={`w-1 sm:w-1.5 rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-gradient-to-t from-emerald-600 via-amber-500 to-amber-300 shadow-xs shadow-amber-500/50'
                : isBuffering
                ? 'bg-amber-600/40 animate-pulse'
                : 'bg-white/10'
            }`}
            style={{
              height: isPlaying
                ? `${heightPercent}%`
                : isBuffering
                ? '30%'
                : '12%',
              animation: isPlaying
                ? `eq-bounce-${(i % 5) + 1} ${animationDuration} ease-in-out infinite alternate ${animationDelay}`
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
