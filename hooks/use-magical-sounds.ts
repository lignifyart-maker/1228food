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

        // WALTZ MODE: 96 BPM 3/4 Time
        const bpm = 96;
        const secondsPerBeat = 60 / bpm;
        const sixteenthNoteTime = secondsPerBeat / 4;
        const totalSteps = Math.floor(durationSeconds / sixteenthNoteTime);
        const notesPerBar = 12;

        // 10 Distinct Melody Themes similar to "Tennessee Waltz" style
        // Each defines a "Personality" for the composition
        const THEMES = [
            { name: "The Storyteller", octave: 0, probability: 0.8, jumpSize: 1, description: "Simple, step-wise, lyrical" },
            { name: "The Dancer", octave: 1, probability: 0.9, jumpSize: 4, description: "Jumpy, energetic, arpeggios" },
            { name: "The Dreamer", octave: 1, probability: 0.5, jumpSize: 2, description: "Sparse, high-pitched, floating" },
            { name: "The River", octave: 0, probability: 1.0, jumpSize: 1, description: "Continuous 8th notes, flowing" },
            { name: "The Mountain", octave: -1, probability: 0.7, jumpSize: 5, description: "Grand, wide intervals, deeper" },
            { name: "The Breeze", octave: 2, probability: 0.6, jumpSize: 3, description: "Very high, delicate, airy" },
            { name: "The Memory", octave: 0, probability: 0.6, jumpSize: 0, description: "Repetitive, nostalgic, lingering notes" },
            { name: "The Heartbeat", octave: 0, probability: 0.75, jumpSize: 2, description: "Focus on downbeats, rhythmic" },
            { name: "The Sunset", octave: 0, probability: 0.85, jumpSize: 3, description: "Warm, rich, harmonious moves" },
            { name: "The Star", octave: 2, probability: 0.4, jumpSize: 6, description: "sparkling, distant, rare notes" }
        ];

        // Randomly select one theme for this 30s journey
        const selectedTheme = THEMES[Math.floor(Math.random() * THEMES.length)];

        for (let step = 0; step < totalSteps; step++) {
            const startTime = now + (step * sixteenthNoteTime);
            const barStep = step % notesPerBar;

            // --- FOUNDATION (Consistent across themes for Waltz feel) ---

            // Bass on Beat 1 (Warm, grounding)
            if (barStep === 0) {
                const bassIndex = indices[Math.floor(step / notesPerBar) % indices.length];
                const bassSeed = SOUND_SEEDS[Math.abs(bassIndex) % 10];
                triggerSound(ctx, bassSeed, startTime, 0.12);
            }

            // Strummed Harmony on Beat 2 & 3
            if (barStep === 4 || barStep === 8) {
                const chordIndex = indices[(Math.floor(step / notesPerBar) + 1) % indices.length];
                const chordSeed = SOUND_SEEDS[(Math.abs(chordIndex) % 15) + 10];
                triggerSound(ctx, chordSeed, startTime, 0.05);
            }

            // --- MELODY (Driven by Selected Theme) ---
            // Most waltz melodies move on 8th notes (every 2 steps)
            const isMelodySlot = step % 2 === 0;

            if (isMelodySlot) {
                // algorithmic "composition" based on theme parameters

                // 1. Should we play a note here? (Rhythm)
                // Use a deterministic noise function based on step + Theme probability
                const rhythmNoise = Math.sin(step * 0.8 + selectedTheme.jumpSize); // pseudo-random walk
                const shouldPlay = (rhythmNoise + 1) / 2 < selectedTheme.probability;

                if (shouldPlay) {
                    // 2. Which note? (Pitch)
                    // Walk through user history
                    const indexWalk = (step + Math.floor(step / 16)) % indices.length;
                    const rawIndex = indices[indexWalk];

                    // Apply Theme Octave
                    // Base range is roughly index 20-40 (Mid-High).
                    // Theme.octave shifts this by 5 indices (~an octave in pentatonic)
                    let baseSeedIndex = (Math.abs(rawIndex) % 20) + 15 + (selectedTheme.octave * 5);

                    // Apply Theme "Jumpiness" (Intervals)
                    // If jumpSize is high, we modulate the index more aggressively based on step
                    const intervalMod = (step % 2 === 0 ? 1 : -1) * (step % selectedTheme.jumpSize);
                    let finalSeedIndex = baseSeedIndex + intervalMod;

                    // Clamp to valid range
                    finalSeedIndex = Math.max(0, Math.min(finalSeedIndex, SOUND_SEEDS.length - 1));

                    const melodySeed = SOUND_SEEDS[finalSeedIndex];

                    // Dynamics (Phrasing)
                    // Arc volume over the bar (Loudest at start, quiet at end)
                    let melVolume = 0.07;
                    if (barStep === 0) melVolume = 0.1;
                    if (barStep >= 10) melVolume = 0.04;

                    triggerSound(ctx, melodySeed, startTime, melVolume);
                }
            }
        }
    }, []);

    const playRandomSound = () => playNote();

    return { playNote, playSequence, playRandomSound };
};
