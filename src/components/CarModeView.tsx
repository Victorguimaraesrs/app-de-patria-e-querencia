import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  RefreshCw,
  ArrowLeft,
  Music2,
  Car,
  WifiOff,
  MessageSquare,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { TrackInfo } from '../hooks/useNowPlaying';

interface CarModeViewProps {
  track: TrackInfo;
  isPlaying: boolean;
  isBuffering: boolean;
  hasError: boolean;
  isOnline: boolean;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onVolumeChange: (newVol: number) => void;
  onToggleMute: () => void;
  onReconnect: () => void;
  onExitCarMode: () => void;
  onRequestSong: () => void;
}

export function CarModeView({
  track,
  isPlaying,
  isBuffering,
  hasError,
  isOnline,
  volume,
  isMuted,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
  onReconnect,
  onExitCarMode,
  onRequestSong,
}: CarModeViewProps) {
  const [wakeLockActive, setWakeLockActive] = useState(false);

  // Keep screen awake while in Car Mode if supported
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
          setWakeLockActive(true);
        }
      } catch (err) {
        console.warn('Wake Lock not available:', err);
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, []);

  const handleStepVolume = (delta: number) => {
    const current = isMuted ? 0 : volume;
    const next = Math.min(1, Math.max(0, current + delta));
    onVolumeChange(Number(next.toFixed(2)));
  };

  const currentVolPct = isMuted ? 0 : Math.round(volume * 100);

  return (
    <div className="min-h-screen bg-[#070B0E] text-slate-100 flex flex-col justify-between p-4 sm:p-8 select-none font-sans relative overflow-hidden">
      {/* Ambient Chimarrão Backdrop with deep automotive vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/assets/aistudio/image_aab7f0d0.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-10 blur-xl scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B0E]/90 via-[#070B0E]/95 to-[#070B0E]" />
      </div>

      {/* 1. CAR MODE TOP BAR: High-contrast with station logo */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between gap-4 py-2 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          {/* Logo badge in header */}
          <div className="h-11 sm:h-12 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 flex items-center justify-center shadow-md">
            <img
              src="/assets/aistudio/image_15260716.png"
              alt="Logo Rádio de Pátria e Querência"
              referrerPolicy="no-referrer"
              className="h-8 sm:h-9 w-auto object-contain drop-shadow"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-400">
                MODO CARRO
              </span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-xs text-amber-400/90 font-semibold hidden sm:inline">
                Ao Vivo no Ar
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-300">
              Rádio de Pátria e Querência
            </h1>
          </div>
        </div>

        {/* Big tactile exit button */}
        <button
          onClick={onExitCarMode}
          className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-all cursor-pointer shadow-lg shrink-0"
          aria-label="Sair do Modo Carro"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span>Sair do Modo Carro</span>
        </button>
      </header>

      {/* OFFLINE WARNING */}
      {!isOnline && (
        <div className="relative z-10 max-w-4xl mx-auto w-full my-2 bg-amber-500 text-slate-950 px-4 py-2 rounded-xl font-bold text-center text-sm flex items-center justify-center gap-2">
          <WifiOff className="w-5 h-5" />
          <span>Sem conexão de internet no veículo.</span>
        </div>
      )}

      {/* 2. MAIN CENTER STAGE: Prominent Station Logo Badge + Track Title & Artist + GIGANTIC Play/Pause */}
      <main className="relative z-10 w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center items-center py-4 sm:py-6 space-y-5 sm:space-y-6 text-center">
        {/* HIGHLIGHTED STATION LOGO DISPLAY */}
        <div className="relative group">
          {/* Ambient Glow under Logo */}
          <div
            className={`absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 blur-xl transition-opacity duration-700 pointer-events-none ${
              isPlaying ? 'opacity-100 scale-105' : 'opacity-40'
            }`}
          />

          <div
            className={`relative px-6 py-3.5 sm:px-8 sm:py-4 rounded-3xl bg-gradient-to-b from-[#111A1F]/90 to-black/90 border transition-all duration-500 shadow-2xl flex flex-col items-center justify-center gap-2 ${
              isPlaying
                ? 'border-amber-500/50 shadow-amber-500/20 ring-2 ring-amber-400/30'
                : 'border-white/10 shadow-black/80'
            }`}
          >
            {/* The Official Radio Logo Image */}
            <img
              src="/assets/aistudio/image_15260716.png"
              alt="Logo Oficial Rádio de Pátria e Querência"
              referrerPolicy="no-referrer"
              className={`h-16 sm:h-24 md:h-28 w-auto object-contain transition-transform duration-500 drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] ${
                isPlaying ? 'scale-105' : ''
              }`}
            />

            {/* Slogan & Location Badge */}
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-amber-300/90 tracking-wide">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                Parobé / RS
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>O melhor da música da Pátria Gaúcha</span>
            </div>
          </div>
        </div>

        {/* Track Info Display (Ultra-large, clear at a glance) */}
        <div className="w-full px-2 space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Music2 className="w-3.5 h-3.5" />
            <span>Tocando Agora na Rádio</span>
          </div>

          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight line-clamp-2 drop-shadow-md"
            title={track.title}
          >
            {track.title}
          </h2>

          <p
            className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-400 line-clamp-1 drop-shadow-sm"
            title={track.artist}
          >
            {track.artist}
          </p>
        </div>

        {/* GIGANTIC PLAY / PAUSE BUTTON */}
        <div className="relative py-1">
          {isPlaying && (
            <div className="absolute inset-0 rounded-full bg-amber-500/25 blur-2xl scale-125 animate-pulse pointer-events-none" />
          )}

          <button
            onClick={onTogglePlay}
            disabled={!isOnline}
            className={`relative w-28 h-28 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shadow-2xl ${
              isPlaying
                ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 ring-8 ring-amber-500/30 shadow-amber-500/40 hover:scale-105'
                : 'bg-gradient-to-b from-amber-500 to-amber-600 text-slate-950 ring-4 ring-amber-400/40 hover:from-amber-400 hover:to-amber-500 hover:scale-105'
            }`}
            aria-label={isPlaying ? 'Pausar transmissão' : 'Tocar transmissão'}
          >
            {isBuffering ? (
              <RefreshCw className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-slate-950" />
            ) : isPlaying ? (
              <Pause className="w-12 h-12 sm:w-16 sm:h-16 fill-slate-950 text-slate-950" />
            ) : (
              <Play className="w-12 h-12 sm:w-16 sm:h-16 fill-slate-950 text-slate-950 translate-x-1" />
            )}
          </button>
        </div>

        {/* Status Text & Reconnect */}
        <div className="flex items-center justify-center gap-3">
          {hasError ? (
            <button
              onClick={onReconnect}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              Reconectar Transmissão
            </button>
          ) : isBuffering ? (
            <span className="text-amber-400 text-sm sm:text-base font-bold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Sintonizando sinal da rádio...
            </span>
          ) : isPlaying ? (
            <span className="text-emerald-400 text-sm sm:text-base font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              AO VIVO · TRANSMISSÃO ESTÁVEL
            </span>
          ) : (
            <span className="text-slate-400 text-sm sm:text-base font-semibold">
              Toque no botão central para dar o play
            </span>
          )}
        </div>
      </main>

      {/* 3. GIGANTIC TACTILE VOLUME & QUICK ACTIONS */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto space-y-3 pt-3 border-t border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* MUTE BUTTON */}
          <div className="sm:col-span-3 flex justify-center sm:justify-start">
            <button
              onClick={onToggleMute}
              className={`w-full sm:w-auto px-5 py-3.5 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm sm:text-base transition-all active:scale-95 cursor-pointer border ${
                isMuted || volume === 0
                  ? 'bg-red-950/80 border-red-500/50 text-red-300'
                  : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
              }`}
              aria-label={isMuted ? 'Desativar mudo' : 'Ativar mudo'}
            >
              {isMuted || volume === 0 ? (
                <>
                  <VolumeX className="w-6 h-6 text-red-400" />
                  <span>Mudo</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-6 h-6 text-amber-400" />
                  <span>Som Ligado</span>
                </>
              )}
            </button>
          </div>

          {/* LARGE VOLUME CONTROLS (- / GAUGE / +) */}
          <div className="sm:col-span-6 flex items-center justify-center gap-3 sm:gap-4 bg-white/5 border border-white/10 p-2 sm:p-2.5 rounded-2xl">
            {/* Minus Button */}
            <button
              onClick={() => handleStepVolume(-0.1)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center font-bold text-2xl border border-white/10 transition-transform cursor-pointer"
              aria-label="Diminuir volume"
            >
              <Minus className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* Visual Volume Gauge */}
            <div className="flex-1 text-center space-y-1 px-2">
              <span className="text-lg sm:text-2xl font-mono font-black text-amber-400 tabular-nums">
                {currentVolPct}%
              </span>
              <div className="w-full h-2.5 sm:h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-150"
                  style={{ width: `${currentVolPct}%` }}
                />
              </div>
            </div>

            {/* Plus Button */}
            <button
              onClick={() => handleStepVolume(0.1)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center font-bold text-2xl border border-white/10 transition-transform cursor-pointer"
              aria-label="Aumentar volume"
            >
              <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </div>

          {/* QUICK PEDIR MÚSICA / WHATSAPP ACTION */}
          <div className="sm:col-span-3 flex justify-center sm:justify-end">
            <button
              onClick={onRequestSong}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-950/50"
            >
              <MessageSquare className="w-5 h-5 fill-slate-950" />
              <span>Pedir Música</span>
            </button>
          </div>
        </div>

        {/* Informative indicator */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>Modo Otimizado para Trânsito e Centrais Multimídia</span>
          {wakeLockActive && (
            <span className="text-emerald-500/80 font-medium">
              Tela mantida ativa automaticamente
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
