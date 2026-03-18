import { useCallback, useRef } from 'react';

/**
 * Custom hook that generates transaction sound effects using the Web Audio API.
 * No external audio files needed — all sounds are synthesized programmatically.
 */
export function useSound() {
    const audioCtxRef = useRef<AudioContext | null>(null);

    const getAudioContext = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
        }
        // Resume if suspended (browser autoplay policy)
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    }, []);

    /**
     * 🪙 Mint Sound — Bright ascending chime (coin drop + success)
     * A pleasant major chord arpeggio with sparkle
     */
    const playMintSound = useCallback(() => {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Ascending notes: C5, E5, G5, C6 (major chord arpeggio)
            const frequencies = [523.25, 659.25, 783.99, 1046.50];
            const noteDuration = 0.12;

            frequencies.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * noteDuration);

                gain.gain.setValueAtTime(0, now + i * noteDuration);
                gain.gain.linearRampToValueAtTime(0.15, now + i * noteDuration + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * noteDuration + noteDuration + 0.1);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now + i * noteDuration);
                osc.stop(now + i * noteDuration + noteDuration + 0.15);
            });

            // Add a shimmer/sparkle overlay
            const shimmer = ctx.createOscillator();
            const shimmerGain = ctx.createGain();
            shimmer.type = 'triangle';
            shimmer.frequency.setValueAtTime(2093, now + 0.35);
            shimmerGain.gain.setValueAtTime(0, now + 0.35);
            shimmerGain.gain.linearRampToValueAtTime(0.08, now + 0.38);
            shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            shimmer.connect(shimmerGain);
            shimmerGain.connect(ctx.destination);
            shimmer.start(now + 0.35);
            shimmer.stop(now + 0.65);
        } catch {
            // Silently fail if Web Audio API is not available
        }
    }, [getAudioContext]);

    /**
     * 🔥 Burn Sound — Deep descending tone with warm "whoosh" effect
     * Evokes fire/destruction feeling
     */
    const playBurnSound = useCallback(() => {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Deep descending sweep
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.5);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

            // Add a low-pass filter for warmth
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.exponentialRampToValueAtTime(200, now + 0.5);
            filter.Q.setValueAtTime(2, now);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.55);

            // Crackle/fire texture
            const noise = ctx.createOscillator();
            const noiseGain = ctx.createGain();
            noise.type = 'square';
            noise.frequency.setValueAtTime(220, now);
            noise.frequency.exponentialRampToValueAtTime(55, now + 0.4);
            noiseGain.gain.setValueAtTime(0.04, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            noise.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noise.start(now);
            noise.stop(now + 0.45);
        } catch {
            // Silently fail if Web Audio API is not available
        }
    }, [getAudioContext]);

    /**
     * ❌ Error Sound — Short dissonant buzzer
     * Two clashing frequencies for an unmistakable "wrong" feeling
     */
    const playErrorSound = useCallback(() => {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Two clashing tones (minor 2nd interval)
            [310, 330].forEach((freq) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.3);
            });
        } catch {
            // Silently fail if Web Audio API is not available
        }
    }, [getAudioContext]);

    return { playMintSound, playBurnSound, playErrorSound };
}
