/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Download,
  Moon,
  MessageSquare,
  Calendar,
  Share2,
  Radio,
  Wifi,
  WifiOff,
  RefreshCw,
  ExternalLink,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Music2,
  Bell,
  BellRing,
  X,
  Flame,
  Car,
} from 'lucide-react';
import { usePWAInstall } from './hooks/usePWAInstall';
import { PWAInstallModal } from './components/PWAInstallModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { SongRequestModal } from './components/SongRequestModal';
import { ProgramGuideModal } from './components/ProgramGuideModal';
import { ShareModal } from './components/ShareModal';
import { AudioVisualizer } from './components/AudioVisualizer';
import { NotificationModal, SpecialProgram } from './components/NotificationModal';
import { SocialNewsFeed } from './components/SocialNewsFeed';
import { NowPlayingCard } from './components/NowPlayingCard';
import { CarModeView } from './components/CarModeView';
import { useNowPlaying } from './hooks/useNowPlaying';

// Primary live audio stream of Rádio de Pátria e Querência
const STREAM_URL = 'https://stm8.painelvox.com:6822/stream';

export default function App() {
  // PWA install hook
  const { isInstallable, isInstalled, isIOS, isStandalone, install } = usePWAInstall();

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('radio_volume');
    return saved !== null ? parseFloat(saved) : 0.85;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Sleep Timer state (in seconds)
  const [sleepTimerSeconds, setSleepTimerSeconds] = useState<number | null>(null);
  const baseVolumeBeforeFadeRef = useRef<number>(volume);

  // Modals state
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showSongModal, setShowSongModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [activeAlertProgram, setActiveAlertProgram] = useState<SpecialProgram | null>(null);

  // Car Mode layout state (simplified, huge touch buttons, hides secondary noise)
  const [isCarMode, setIsCarMode] = useState(() => {
    try {
      return localStorage.getItem('radio_car_mode') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleCarMode = () => {
    setIsCarMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('radio_car_mode', String(next));
      } catch {
        // LocalStorage fallback
      }
      return next;
    });
  };

  // Trigger special program notification (both Web Notification and In-App Toast)
  const handleTriggerSpecialNotification = useCallback((program: SpecialProgram) => {
    setActiveAlertProgram(program);

    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(`Rádio de Pátria e Querência`, {
          body: `O programa "${program.title}" está prestes a começar (${program.schedule})! Venha matear e ouvir ao vivo. 📻🧉`,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: `radio-special-${program.id}`,
        });
      } catch (err) {
        console.warn('Erro ao disparar notificação nativa:', err);
      }
    }

    // Auto-dismiss in-app banner after 12 seconds
    setTimeout(() => {
      setActiveAlertProgram((current) =>
        current?.id === program.id ? null : current
      );
    }, 12000);
  }, []);

  // Connection listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasError(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsPlaying(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time track metadata (Song Title & Artist) polled directly from station stream
  const { track } = useNowPlaying(isPlaying);
  const [prefilledTrack, setPrefilledTrack] = useState<{ song: string; artist: string }>({
    song: '',
    artist: '',
  });

  // Handler to open Song Request modal prefilled with current playing track
  const handleRequestTrack = (songName: string, artistName: string) => {
    setPrefilledTrack({ song: songName, artist: artistName });
    setShowSongModal(true);
  };

  // Sync browser document title with currently playing song & artist
  useEffect(() => {
    if (isPlaying && track.title && track.artist !== 'Rádio de Pátria e Querência') {
      document.title = `🎵 ${track.artist} - ${track.title} | Rádio de Pátria e Querência`;
    } else {
      document.title = 'Rádio de Pátria e Querência - O melhor da música da Pátria Gaúcha';
    }
  }, [isPlaying, track]);

  // Update MediaSession API for lockscreen controls, car displays, and notification player
  const setupMediaSession = useCallback(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        handlePlay();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        handlePause();
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        handlePause();
      });
    }
  }, []);

  // Sync real-time song title and artist to OS lockscreen & Bluetooth via MediaSession
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: 'Rádio de Pátria e Querência - Ao Vivo',
        artwork: [
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      });
    }
  }, [track]);

  // Initialize Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';

    audio.addEventListener('playing', () => {
      setIsPlaying(true);
      setIsBuffering(false);
      setHasError(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    });

    audio.addEventListener('waiting', () => {
      setIsBuffering(true);
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
      setIsBuffering(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    });

    audio.addEventListener('error', (e) => {
      // Ignore error events triggered when paused or idle
      if (audio.paused || !audio.src || audio.src === '') return;
      console.warn('Erro no stream de áudio:', e);
      setIsPlaying(false);
      setIsBuffering(false);
      setHasError(true);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none';
      }
    });

    audioRef.current = audio;
    setupMediaSession();

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [setupMediaSession]);

  // Handle Play
  const handlePlay = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    setHasError(false);
    setIsBuffering(true);

    // Always connect to current live broadcast moment with fresh timestamp
    audio.src = `${STREAM_URL}?nocache=${Date.now()}`;
    audio.volume = isMuted ? 0 : volume;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
          setHasError(false);
          if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'playing';
          }
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          console.warn('Falha na reprodução de áudio:', err);
          setIsPlaying(false);
          setIsBuffering(false);
          setHasError(true);
        });
    }
  };

  // Handle Pause
  const handlePause = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
    setIsBuffering(false);
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused';
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  // Volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(false);
    localStorage.setItem('radio_volume', newVolume.toString());
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      setIsMuted(false);
      audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      audioRef.current.volume = 0;
    }
  };

  // Reconnect stream
  const handleReconnect = () => {
    if (!audioRef.current) return;
    handlePause();
    setTimeout(() => {
      handlePlay();
    }, 400);
  };

  // Sleep Timer countdown logic
  useEffect(() => {
    if (sleepTimerSeconds === null) return;

    if (sleepTimerSeconds <= 0) {
      // Time is up! Pause audio and reset volume
      handlePause();
      if (audioRef.current) {
        audioRef.current.volume = baseVolumeBeforeFadeRef.current;
      }
      setSleepTimerSeconds(null);
      return;
    }

    // Smooth volume fade out in last 30 seconds
    if (sleepTimerSeconds <= 30 && audioRef.current && !isMuted) {
      const fadeFactor = Math.max(0, sleepTimerSeconds / 30);
      audioRef.current.volume = baseVolumeBeforeFadeRef.current * fadeFactor;
    }

    const interval = setInterval(() => {
      setSleepTimerSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerSeconds, isMuted]);

  // Set Sleep Timer
  const handleSetSleepTimer = (minutes: number) => {
    baseVolumeBeforeFadeRef.current = volume;
    setSleepTimerSeconds(minutes * 60);
  };

  // Cancel Sleep Timer
  const handleCancelSleepTimer = () => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    setSleepTimerSeconds(null);
  };

  // CAR MODE: Streamlined driving layout with huge controls & no secondary clutter
  if (isCarMode) {
    return (
      <div className="min-h-screen bg-[#070B0E] text-slate-100 font-sans-custom">
        <CarModeView
          track={track}
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          hasError={hasError}
          isOnline={isOnline}
          volume={volume}
          isMuted={isMuted}
          onTogglePlay={togglePlay}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onReconnect={handleReconnect}
          onExitCarMode={() => {
            setIsCarMode(false);
            try {
              localStorage.setItem('radio_car_mode', 'false');
            } catch {}
          }}
          onRequestSong={() => {
            handleRequestTrack(track.title, track.artist);
          }}
        />

        {/* Retain Song Request Modal in Car Mode */}
        <SongRequestModal
          isOpen={showSongModal}
          onClose={() => {
            setShowSongModal(false);
            setPrefilledTrack({ song: '', artist: '' });
          }}
          initialSong={prefilledTrack.song}
          initialArtist={prefilledTrack.artist}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090E11] text-slate-100 flex flex-col font-sans-custom relative overflow-x-hidden">
      {/* Ambient Panoramic Chimarrão Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/assets/aistudio/image_aab7f0d0.png"
          alt=""
          aria-hidden="true"
          className="w-full h-96 object-cover object-top opacity-15 blur-2xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090E11]/85 to-[#090E11]" />
      </div>

      {/* 1. TOP BAR CONTRACT: 3 Zones (Wordmark - Nav links - 1 Primary Action) */}
      <header className="sticky top-0 z-40 bg-[#090E11]/90 backdrop-blur-md border-b border-amber-950/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand title, one line wordmark */}
          <a
            href="/"
            className="flex items-center gap-3 text-base sm:text-lg font-bold font-display tracking-wide text-amber-400 whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors"
          >
            <img
              src="/assets/aistudio/image_15260716.png"
              alt="Logo Rádio de Pátria e Querência"
              referrerPolicy="no-referrer"
              className="h-9 w-auto object-contain shrink-0 drop-shadow-sm"
            />
            <span className="hidden sm:inline">RÁDIO DE PÁTRIA E QUERÊNCIA</span>
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
            <button
              onClick={handleToggleCarMode}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-amber-400 font-semibold"
            >
              <Car className="w-4 h-4 text-amber-400" />
              Modo Carro
            </button>
            <button
              onClick={() => setShowSongModal(true)}
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Pedir Música
            </button>
            <a
              href="#noticias"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              Notícias
            </a>
            <button
              onClick={() => setShowNotificationModal(true)}
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              Lembretes
            </button>
            <button
              onClick={() => setShowProgramModal(true)}
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-500" />
              Programação
            </button>
            <button
              onClick={() => setShowSleepModal(true)}
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              Timer de Sono
            </button>
            <a
              href="https://www.radiodepatriaequerencia.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              Portal Oficial
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </nav>

          {/* Zone 3: Primary Actions (Modo Carro + Install App) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Modo Carro Toggle Button */}
            <button
              onClick={handleToggleCarMode}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 active:scale-95 shadow-sm"
              title="Ativar Modo Carro (Botões grandes e layout simplificado)"
            >
              <Car className="w-4 h-4 text-amber-400" />
              <span>Modo Carro</span>
            </button>

            {isStandalone ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold whitespace-nowrap shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">App Instalado</span>
              </div>
            ) : (
              <button
                onClick={async () => {
                  if (isInstallable) {
                    const ok = await install();
                    if (!ok) setShowInstallModal(true);
                  } else {
                    setShowInstallModal(true);
                  }
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-lg hover:from-amber-400 hover:to-amber-300 transition-all shadow-md shadow-amber-950/50 whitespace-nowrap shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Instalar Aplicativo</span>
                <span className="sm:hidden">Instalar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* OFFLINE OR ERROR BANNER */}
      {!isOnline && (
        <div className="bg-amber-600/90 text-slate-950 px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>Você está desconectado da internet. O player continuará assim que a rede voltar.</span>
        </div>
      )}

      {/* MAIN CONTAINER: Dedicated Player + Social News Feed */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12">
        {/* CENTERED AUDIO PLAYER CARD */}
        <div className="w-full max-w-xl mx-auto rounded-3xl bg-[#111A1F] border border-amber-900/40 p-6 sm:p-8 flex flex-col shadow-2xl shadow-black/80 relative overflow-hidden">
          {/* Ambient Background Aura */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-700/10 blur-3xl pointer-events-none" />

          {/* Top metadata row (Clean unboxed metadata, zero-pill discipline) */}
          <div className="flex items-center justify-between gap-4 text-xs text-slate-400 mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                AO VIVO
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-500/80" />
                Parobé / RS
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">96 kbps AAC</span>
            </div>

            {/* Active Sleep Timer Indicator */}
            {sleepTimerSeconds !== null && (
              <button
                onClick={() => setShowSleepModal(true)}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-mono text-xs tabular-nums cursor-pointer"
              >
                <Moon className="w-3.5 h-3.5 animate-pulse" />
                <span>
                  {Math.floor(sleepTimerSeconds / 60)}:
                  {(sleepTimerSeconds % 60).toString().padStart(2, '0')}
                </span>
              </button>
            )}
          </div>

          {/* Central Official Chimarrão & Station Banner */}
          <div className="flex flex-col items-center gap-3 my-2 text-center relative z-10">
            {/* Panoramic Station Banner with Chimarrão and Official Logo */}
            <div className="w-full relative group py-1">
              <div
                className={`relative w-full rounded-2xl overflow-hidden border border-amber-500/40 bg-black/60 shadow-2xl shadow-amber-950/50 transition-all duration-500 ${
                  isPlaying
                    ? 'ring-2 ring-amber-400/50 shadow-amber-500/25 scale-[1.01]'
                    : ''
                }`}
              >
                <img
                  src="/assets/aistudio/image_aab7f0d0.png"
                  alt="Rádio de Pátria e Querência - Chimarrão e Tradição Gaúcha"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111A1F]/70 via-transparent to-black/20 pointer-events-none" />

                {/* Live soundwave badge in corner */}
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-emerald-600/95 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-emerald-400/50 backdrop-blur-xs">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPlaying ? 'bg-slate-950 animate-ping' : 'bg-slate-950'
                    }`}
                  />
                  <Music2 className="w-3 h-3" />
                  {isPlaying ? 'No Ar · Ao Vivo' : 'Rádio Web'}
                </div>
              </div>
            </div>

            {/* Slogan & Tags */}
            <div className="space-y-1 pt-1">
              <p className="text-sm sm:text-base font-semibold text-amber-300">
                O melhor da música da Pátria Gaúcha
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
                <span>Parobé / RS</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Música Nativista</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Folclore dos Galpões</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Três Pátrias</span>
              </div>
            </div>
          </div>

          {/* Real-time Now Playing Card: Displays Artist & Song Name for every track */}
          <div className="my-3 relative z-10">
            <NowPlayingCard
              track={track}
              isPlaying={isPlaying}
              onSongRequest={handleRequestTrack}
            />
          </div>

          {/* Equalizer Visualizer */}
          <div className="my-4 relative z-10">
            <AudioVisualizer isPlaying={isPlaying} isBuffering={isBuffering} />
          </div>

          {/* Error Message Box if playback fails */}
          {hasError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/40 text-red-200 text-xs flex items-center justify-between gap-3 relative z-10">
              <span>Não foi possível carregar a transmissão no momento. Verifique sua conexão.</span>
              <button
                onClick={handleReconnect}
                className="px-3 py-1 rounded-md bg-red-800 hover:bg-red-700 text-white font-semibold flex items-center gap-1 whitespace-nowrap cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reconectar
              </button>
            </div>
          )}

          {/* Tactile Playback & Volume Controls */}
          <div className="pt-2 pb-1 space-y-4 relative z-10">
            {/* Elegant Compact Play / Pause Button */}
            <div className="flex items-center justify-center">
              <div className="relative group">
                {/* Ambient glow when playing */}
                {isPlaying && (
                  <div className="absolute -inset-1 rounded-full bg-amber-500/25 blur-md animate-pulse pointer-events-none" />
                )}
                <button
                  onClick={togglePlay}
                  disabled={!isOnline}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 ${
                    isPlaying
                      ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-[0_0_24px_rgba(245,158,11,0.35),inset_0_1px_2px_rgba(255,255,255,0.7)] ring-2 ring-amber-400/60 hover:ring-amber-300 hover:shadow-[0_0_28px_rgba(245,158,11,0.5)]'
                      : 'bg-gradient-to-b from-amber-400/95 via-amber-500 to-amber-600 text-slate-950 shadow-[0_6px_18px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.6)] ring-1 ring-amber-400/50 hover:from-amber-300 hover:to-amber-500 hover:shadow-[0_8px_22px_rgba(217,119,6,0.4)]'
                  }`}
                  aria-label={isPlaying ? 'Pausar rádio' : 'Tocar rádio'}
                >
                  {/* Subtle specular top highlight */}
                  <span className="absolute inset-x-2.5 top-0.5 h-[38%] rounded-t-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

                  {isBuffering ? (
                    <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 animate-spin text-slate-950" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-slate-950 text-slate-950" />
                  ) : (
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-slate-950 text-slate-950 translate-x-0.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Status Text under Play button */}
            <div className="text-center text-xs text-slate-300">
              {isBuffering ? (
                <span className="text-amber-400 flex items-center justify-center gap-1.5 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Conectando ao sinal da rádio...
                </span>
              ) : isPlaying ? (
                <span className="text-emerald-400 font-medium flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Transmitindo ao vivo · Sinal estável
                </span>
              ) : (
                <span className="text-slate-400">
                  Toque no botão para ouvir a rádio
                </span>
              )}
            </div>

            {/* Volume Slider with Mute Button */}
            <div className="flex items-center justify-center gap-3 max-w-sm mx-auto px-4 py-2.5 rounded-2xl bg-black/40 border border-white/5">
              <button
                onClick={toggleMute}
                className="p-1.5 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                aria-label={isMuted ? 'Desativar mudo' : 'Ativar mudo'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                aria-label="Controle de volume"
              />

              <span className="text-xs font-mono text-slate-400 w-10 text-right tabular-nums">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
          </div>

          {/* Interactive Action Toolbar (Pedir Música, Timer, Notificações, Programação, Compartilhar) */}
          <div className="mt-6 pt-5 border-t border-amber-900/30 grid grid-cols-2 sm:grid-cols-5 gap-2 relative z-10">
            <button
              onClick={() => setShowSongModal(true)}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/30 text-slate-200 hover:text-emerald-400 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-medium cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Pedir Música</span>
            </button>

            <button
              onClick={() => setShowNotificationModal(true)}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-950/40 border border-white/5 hover:border-amber-500/30 text-slate-200 hover:text-amber-400 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-medium cursor-pointer"
            >
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>Lembretes</span>
            </button>

            <button
              onClick={() => setShowSleepModal(true)}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-indigo-950/40 border border-white/5 hover:border-indigo-500/30 text-slate-200 hover:text-indigo-300 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-medium cursor-pointer"
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>
                {sleepTimerSeconds !== null ? 'Timer Ativo' : 'Timer de Sono'}
              </span>
            </button>

            <button
              onClick={() => setShowProgramModal(true)}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-950/40 border border-white/5 hover:border-amber-500/30 text-slate-200 hover:text-amber-400 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-medium cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Programação</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-950/40 border border-white/5 hover:border-amber-500/30 text-slate-200 hover:text-amber-400 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-medium cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Compartilhar</span>
            </button>
          </div>

          {/* Quick Car Mode banner */}
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-3 text-xs text-slate-300 relative z-10">
            <span className="flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400" />
              <span>Na estrada ou no trânsito?</span>
            </span>
            <button
              onClick={handleToggleCarMode}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Car className="w-3.5 h-3.5" />
              Abrir Modo Carro
            </button>
          </div>

          {/* Optional In-Card Install prompt if not yet installed */}
          {!isStandalone && (
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-3 text-xs text-slate-400 relative z-10">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Instale no seu celular ou PC
              </span>
              <button
                onClick={async () => {
                  if (isInstallable) {
                    const ok = await install();
                    if (!ok) setShowInstallModal(true);
                  } else {
                    setShowInstallModal(true);
                  }
                }}
                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Instalar App
              </button>
            </div>
          )}
        </div>

        {/* SOCIAL NEWS FEED & EVENTS WIDGET */}
        <div id="noticias">
          <SocialNewsFeed />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-12 bg-black/60 border-t border-amber-950/40 py-8 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/image_15260716.png"
              alt="Logo Rádio de Pátria e Querência"
              referrerPolicy="no-referrer"
              className="h-8 w-auto object-contain"
            />
            <div>
              <p className="font-bold text-slate-200">Rádio de Pátria e Querência</p>
              <p className="text-[11px] text-slate-400">Parobé · Rio Grande do Sul · Brasil</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://www.radiodepatriaequerencia.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              Site Oficial
            </a>
            <span>·</span>
            <button
              onClick={() => setShowInstallModal(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Como Instalar o App
            </button>
            <span>·</span>
            <button
              onClick={() => setShowProgramModal(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Grade de Programas
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        isInstallable={isInstallable}
        isIOS={isIOS}
        onInstall={install}
      />

      <SleepTimerModal
        isOpen={showSleepModal}
        onClose={() => setShowSleepModal(false)}
        activeTimerRemaining={sleepTimerSeconds}
        onSetTimer={handleSetSleepTimer}
        onCancelTimer={handleCancelSleepTimer}
      />

      <SongRequestModal
        isOpen={showSongModal}
        onClose={() => {
          setShowSongModal(false);
          setPrefilledTrack({ song: '', artist: '' });
        }}
        initialSong={prefilledTrack.song}
        initialArtist={prefilledTrack.artist}
      />

      <ProgramGuideModal
        isOpen={showProgramModal}
        onClose={() => setShowProgramModal(false)}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onTriggerTestNotification={handleTriggerSpecialNotification}
      />

      {/* FLOATING IN-APP NOTIFICATION BANNER */}
      {activeAlertProgram && (
        <aside
          aria-live="polite"
          className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#12221B] border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl shadow-black/95 text-white"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                <BellRing className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Radio className="w-3 h-3" /> Programa Especial no Ar!
                </span>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {activeAlertProgram.title}
                </h4>
                <p className="text-xs text-slate-300">
                  {activeAlertProgram.schedule} · Ao vivo na Querência
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveAlertProgram(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              aria-label="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400">
              Transmitindo agora
            </span>
            <button
              onClick={() => {
                if (!isPlaying) handlePlay();
                setActiveAlertProgram(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Ouvir Agora
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
