/**
 * Hook to poll and provide real-time now-playing song and artist information
 * from the Shoutcast server of Rádio de Pátria e Querência.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface TrackInfo {
  artist: string;
  title: string;
  raw: string;
  listeners: number;
  bitrate: string;
  updatedAt: number;
}

const DEFAULT_TRACK: TrackInfo = {
  artist: 'Rádio de Pátria e Querência',
  title: 'O melhor da música da Pátria Gaúcha',
  raw: 'Rádio de Pátria e Querência - O melhor da música da Pátria Gaúcha',
  listeners: 0,
  bitrate: '96 kbps',
  updatedAt: Date.now(),
};

function parseSongTitle(raw: string): { artist: string; title: string } {
  if (!raw || !raw.trim()) {
    return {
      artist: 'Rádio de Pátria e Querência',
      title: 'O melhor da música da Pátria Gaúcha',
    };
  }
  const clean = raw.trim();
  const sep = clean.includes(' - ') ? ' - ' : clean.includes(' – ') ? ' – ' : null;
  if (sep) {
    const parts = clean.split(sep);
    const artist = parts[0].trim();
    const title = parts.slice(1).join(' - ').trim();
    return {
      artist: artist || 'Rádio de Pátria e Querência',
      title: title || 'Música Gaúcha',
    };
  }
  return {
    artist: 'Rádio de Pátria e Querência',
    title: clean,
  };
}

export function useNowPlaying(isPlaying: boolean) {
  const [track, setTrack] = useState<TrackInfo>(DEFAULT_TRACK);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousRawRef = useRef<string>('');

  const fetchTrack = useCallback(async () => {
    try {
      // 1. Try local dev/server proxy first
      const proxyController = new AbortController();
      const proxyTimeout = setTimeout(() => proxyController.abort(), 3500);

      let fetchedData: any = null;
      try {
        const res = await fetch(`/api/now-playing?t=${Date.now()}`, {
          signal: proxyController.signal,
          headers: { Accept: 'application/json' },
        });
        clearTimeout(proxyTimeout);
        if (res.ok) {
          fetchedData = await res.json();
        }
      } catch {
        clearTimeout(proxyTimeout);
      }

      // 2. Fallback to public CORS proxy or direct if local proxy unavailable
      if (!fetchedData || !fetchedData.artist) {
        try {
          const directRes = await fetch(
            `https://api.allorigins.win/raw?url=${encodeURIComponent(
              'https://stm8.painelvox.com:6822/stats?sid=1&json=1'
            )}`
          );
          if (directRes.ok) {
            const rawJson = await directRes.json();
            const rawTitle = (rawJson.songtitle || '').trim();
            const parsed = parseSongTitle(rawTitle);
            fetchedData = {
              artist: parsed.artist,
              title: parsed.title,
              raw: rawTitle,
              listeners: rawJson.currentlisteners ?? 0,
              bitrate: rawJson.bitrate ? `${rawJson.bitrate} kbps` : '96 kbps',
              updatedAt: Date.now(),
            };
          }
        } catch {
          // Direct fallback failed, keep existing
        }
      }

      if (fetchedData && fetchedData.artist) {
        setTrack((prev) => {
          // Only update if something changed
          if (
            prev.artist === fetchedData.artist &&
            prev.title === fetchedData.title &&
            prev.listeners === fetchedData.listeners
          ) {
            return prev;
          }
          return {
            artist: fetchedData.artist,
            title: fetchedData.title,
            raw: fetchedData.raw || `${fetchedData.artist} - ${fetchedData.title}`,
            listeners: fetchedData.listeners ?? prev.listeners,
            bitrate: fetchedData.bitrate ?? prev.bitrate,
            updatedAt: Date.now(),
          };
        });
        setError(null);
        previousRawRef.current = fetchedData.raw || '';
      }
    } catch (err: any) {
      console.warn('Erro ao atualizar música atual:', err);
      setError(err?.message || 'Falha ao obter dados da música');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Poll on mount and periodically every 8 seconds
  useEffect(() => {
    fetchTrack();
    const interval = setInterval(() => {
      fetchTrack();
    }, 8000);

    return () => clearInterval(interval);
  }, [fetchTrack]);

  // Immediately poll when the user presses Play
  useEffect(() => {
    if (isPlaying) {
      fetchTrack();
    }
  }, [isPlaying, fetchTrack]);

  return {
    track,
    isLoading,
    error,
    refresh: fetchTrack,
  };
}
