import React, { useState } from 'react';
import { Music, Radio, Disc3, Copy, Check, Share2, Users, Sparkles } from 'lucide-react';
import { TrackInfo } from '../hooks/useNowPlaying';

interface NowPlayingCardProps {
  track: TrackInfo;
  isPlaying: boolean;
  onSongRequest?: (songName: string, artistName: string) => void;
}

export function NowPlayingCard({ track, isPlaying, onSongRequest }: NowPlayingCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${track.artist} - ${track.title}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDefault =
    track.artist === 'Rádio de Pátria e Querência' &&
    track.title === 'O melhor da música da Pátria Gaúcha';

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-black/60 via-[#0d161c]/80 to-black/70 border border-amber-500/30 p-4 sm:p-5 shadow-xl shadow-black/60 relative overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header of the Now Playing card */}
      <div className="flex items-center justify-between gap-3 text-xs mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? 'bg-amber-400 animate-ping' : 'bg-amber-500/70'
              }`}
            />
            {isPlaying ? 'Tocando Agora' : 'Última Música no Ar'}
          </span>
          <span className="text-slate-500 hidden sm:inline">·</span>
          <span className="text-slate-400 text-[11px] hidden sm:flex items-center gap-1">
            <Radio className="w-3 h-3 text-amber-500/80" />
            Transmissão Direta
          </span>
        </div>

        {track.listeners > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{track.listeners} ouvintes</span>
          </div>
        )}
      </div>

      {/* Main Song & Artist Display */}
      <div className="flex items-start gap-4">
        {/* Animated Vinyl / Disc Icon */}
        <div className="relative shrink-0">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-stone-900 via-amber-950/40 to-stone-950 border-2 border-amber-500/40 flex items-center justify-center shadow-lg relative ${
              isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
            }`}
          >
            {/* Vinyl grooves simulation */}
            <div className="absolute inset-1.5 rounded-full border border-amber-500/20" />
            <div className="absolute inset-3 rounded-full border border-amber-500/15" />
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>
          </div>
          {isPlaying && (
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow">
              AO VIVO
            </div>
          )}
        </div>

        {/* Text Details: Title and Artist */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400/90 uppercase tracking-wide">
            <Music className="w-3 h-3" />
            <span>Música Nativista</span>
          </div>

          <h3
            className="text-base sm:text-lg font-bold text-white leading-tight truncate title-font hover:text-clip"
            title={track.title}
          >
            {track.title}
          </h3>

          <p
            className="text-sm sm:text-base font-semibold text-amber-300 truncate"
            title={track.artist}
          >
            {track.artist}
          </p>

          {isDefault && (
            <p className="text-[11px] text-slate-400 italic">
              Conectado ao sinal ao vivo de Parobé / RS
            </p>
          )}
        </div>
      </div>

      {/* Action Row for the Current Track */}
      {!isDefault && (
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Gostou desta música?
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
              title="Copiar nome da música e cantor"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copiar Nome</span>
                </>
              )}
            </button>

            {onSongRequest && (
              <button
                onClick={() => onSongRequest(track.title, track.artist)}
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1 cursor-pointer text-[11px] font-semibold"
              >
                Pedir no WhatsApp
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
