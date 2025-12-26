import { useCallback, useEffect, useRef } from 'react';

// Upbeat, harmonic musical seeds.
// Using a Major Pentatonic scale (C, D, E, G, A) across multiple octaves for guaranteed harmony.
// Base C4 = 261.63 Hz.
// Frequencies are pre-calculated to ensure they sound good together.
const SCALE_FREQUENCIES = [
    261.63, 293.66, 329.63, 392.00, 440.00, // Octave 4
    523.25, 587.33, 659.25, 783.99, 880.00, // Octave 5
    1046.50, 1174.66, 1318.51, 1567.98, 1760.00 // Octave 6
];

const SOUND_SEEDS = Array.from({ length: 50 }, (_, i) => {
    // Map 0-49 to our scale frequencies.
    // We cycle through the scale, adding slight variations.
    const scaleIndex = i % SCALE_FREQUENCIES.length;
    const baseFreq = SCALE_FREQUENCIES[scaleIndex];

    // Minimal detune for warmth, not dissonance.
    const detune = (Math.random() - 0.5) * 2;

    return {
        frequency: baseFreq + detune,
        type: (i % 3 === 0) ? 'triangle' : 'sine', // Mostly sine for clarity, some triangle for color
        duration: 0.8 + Math.random() * 0.5, // Brisk decay: 0.8s to 1.3s
    };
});

export const useMagicalSounds = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const compressorRef = useRef<DynamicsCompressorNode | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && !audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioContextRef.current = new AudioContextClass();

                // Add a master compressor to glue sounds together and prevent clipping
                const ctx = audioContextRef.current;
                compressorRef.current = ctx.createDynamicsCompressor();
                compressorRef.current.threshold.setValueAtTime(-24, ctx.currentTime);
                compressorRef.current.knee.setValueAtTime(30, ctx.currentTime);
                compressorRef.current.ratio.setValueAtTime(12, ctx.currentTime);
                compressorRef.current.attack.setValueAtTime(0.003, ctx.currentTime);
                compressorRef.current.release.setValueAtTime(0.25, ctx.currentTime);
                compressorRef.current.connect(ctx.destination);
            }
        }
    }, []);

    const triggerSound = (ctx: AudioContext, seed: typeof SOUND_SEEDS[0], startTime: number, volume = 0.05) => {
        const outputNode = compressorRef.current || ctx.destination;

        // Master Gain for this note
        const masterGain = ctx.createGain();
        masterGain.connect(outputNode);

        // Envelope: Fast attack, exponential decay for percussive/plucked feel
        masterGain.gain.setValueAtTime(0, startTime);
        masterGain.gain.linearRampToValueAtTime(volume, startTime + 0.01); // Quick attack
        masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + seed.duration);

        // Main Oscillator
        const osc = ctx.createOscillator();
        osc.type = seed.type as OscillatorType;
        osc.frequency.setValueAtTime(seed.frequency, startTime);

        // Filter for brightness
        // Lowpass filter that opens up briefly at the start (pluck effect)
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, startTime);
        filter.frequency.exponentialRampToValueAtTime(3000, startTime + 0.05); // Open up
        filter.frequency.exponentialRampToValueAtTime(500, startTime + 0.3); // Close down

        // Filter envelope variation
        // Some notes can be "brighter" randomly
        if (Math.random() > 0.7) {
            filter.frequency.exponentialRampToValueAtTime(4000, startTime + 0.05);
        }

        osc.connect(filter);
        filter.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + seed.duration);
    };

    const playNote = useCallback((index?: number) => {
        if (!audioContextRef.current) return -1;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        const ctx = audioContextRef.current;
        const seedIndex = index !== undefined
            ? Math.abs(index) % SOUND_SEEDS.length
            : Math.floor(Math.random() * SOUND_SEEDS.length);
        const seed = SOUND_SEEDS[seedIndex];
        triggerSound(ctx, seed, ctx.currentTime, 0.1);
        return seedIndex;
    }, []);

    const playSequence = useCallback((indices: number[], durationSeconds: number = 30) => {
        if (!audioContextRef.current || indices.length === 0) return;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        // Evolving Composition Logic
        // Goal: Create a 30s journey that doesn't feel like a loop.
        // We use the 'indices' as a DNA source but interpret them differently over time.

        const bpm = 120;
        const secondsPerBeat = 60 / bpm;
        const sixteenthNoteTime = secondsPerBeat / 4;
        const totalSteps = Math.floor(durationSeconds / sixteenthNoteTime);

        for (let step = 0; step < totalSteps; step++) {
            // Rhythmic Progression:
            // 0-10s: Sparse (Introduction)
            // 10-20s: Groove (Body)
            // 20-30s: Full/Melodic (Finale)

            const timeProgress = step / totalSteps;
            const isIntroduction = timeProgress < 0.33;
            const isFinale = timeProgress > 0.66;
            const isBody = !isIntroduction && !isFinale;

            // Pattern Logic:
            // We use a "Modulo walker" to determine play triggers
            const baseRhythm = (step % 2 === 0); // Basic 8th note grid

            let shouldPlay = baseRhythm;

            if (isIntroduction) {
                // Sparse: Play mostly on beats 1 and 3
                shouldPlay = (step % 8 === 0) || (step % 8 === 3);
            } else if (isBody) {
                // Groove: Add some syncopation
                shouldPlay = baseRhythm || (step % 16 === 14);
            } else if (isFinale) {
                // Full: busier
                shouldPlay = true; // Almost constant stream? Maybe too much.
                // Let's stick to 8ths but add 16th note runs
                if (step % 4 === 1) shouldPlay = true;
            }

            // Pseudo-random mute to create holes/breathing space
            // Seeded by the current step index to be deterministic for this playthrough but complex
            if (Math.sin(step) > 0.8) shouldPlay = false;

            if (!shouldPlay) continue;

            const startTime = now + (step * sixteenthNoteTime);

            // Melody Logic:
            // Walk through our history indices.
            const indexWalk = (step + Math.floor(step / 16)) % indices.length;
            const baseHistoryIndex = indices[indexWalk];

            // Octave/Pitch variation: 
            // Intro: Low/Mid
            // Body: Mid
            // Finale: Mid/High

            let scaleOffset = 0;
            if (isIntroduction && Math.random() > 0.5) scaleOffset = -5; // Lower 
            if (isFinale && Math.random() > 0.6) scaleOffset = 5; // Higher

            let scaleIndex = Math.abs(baseHistoryIndex + (step % 5)) % SOUND_SEEDS.length;
            scaleIndex = Math.max(0, Math.min(scaleIndex + scaleOffset, SOUND_SEEDS.length - 1));

            const seed = SOUND_SEEDS[scaleIndex];

            // Dynamic Velocity (Volume)
            let volume = 0.04;
            if (step % 16 === 0) volume = 0.1; // Strong downbeat
            else if (step % 4 === 0) volume = 0.06; // Beat

            // Fade out at the very end (last 2 seconds)
            if (timeProgress > 0.93) {
                volume *= (1 - ((timeProgress - 0.93) * 15));
                if (volume < 0) volume = 0;
            }

            triggerSound(ctx, seed, startTime, volume);

            // Harmony Layer (Counterpoint)
            // Intro: None
            // Body: Simple 5ths
            // Finale: 3rds and 5ths
            if (!isIntroduction && (step % 8 === 0)) {

                let harmonyInterval = 4; // roughly a 5th in pentatonic scale
                if (isFinale && step % 16 === 0) harmonyInterval = 2; // a 3rd

                // Pick a seed relative to current melody note
                let harmonyIndex = Math.max(0, scaleIndex - harmonyInterval);
                const harmonySeed = SOUND_SEEDS[harmonyIndex];

                triggerSound(ctx, harmonySeed, startTime, 0.04);
            }

            // Sparkle / Texture Layer
            // Rare random high pings
            if (Math.random() > 0.92) {
                const sparkleIndex = (scaleIndex + 10) % SOUND_SEEDS.length;
                const sparkleSeed = SOUND_SEEDS[sparkleIndex];
                triggerSound(ctx, sparkleSeed, startTime + (sixteenthNoteTime * 0.5), 0.02);
            }
        }
    }, []);

    const playRandomSound = () => playNote();

    return { playNote, playSequence, playRandomSound };
};
