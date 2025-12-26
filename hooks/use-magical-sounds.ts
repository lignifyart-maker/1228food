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

        // DANCE MODE: 130 BPM, High Energy, Dense
        const bpm = 130;
        const secondsPerBeat = 60 / bpm;
        const sixteenthNoteTime = secondsPerBeat / 4;
        const totalSteps = Math.floor(durationSeconds / sixteenthNoteTime);

        // Pre-calculate a consistent "Theme" from the history to use as the main loop
        // If history is small, repeat it. If large, take a slice.
        const loopLength = 32; // 2 bars of 16th notes
        const melodyPattern = indices.slice(0, 8); // Use first few minerals for core identity

        for (let step = 0; step < totalSteps; step++) {
            const startTime = now + (step * sixteenthNoteTime);

            // 1. THE BEAT (Kick Drum Simulation)
            // Play on every quarter note (step 0, 4, 8, 12...)
            if (step % 4 === 0) {
                // Use a very low frequency note from our seeds as a kick
                // We'll use index 0 or 1 (Low C)
                const kickSeed = SOUND_SEEDS[0];

                // Custom trigger for punchier sound? 
                // We'll stick to triggerSound but give it high volume and short duration via the existing envelope
                triggerSound(ctx, kickSeed, startTime, 0.15);
            }

            // 2. THE BASS (Driving 8th notes)
            // Play on off-beats too (0, 2, 4, 6...)
            // If it's a kick step, we layer it.
            if (step % 2 === 0) {
                // Pick a low note based on history to keep it unique to user
                // Map to lower range of sound seeds (e.g., indices 0-10)
                const bassNoteIndex = indices[(step / 2) % indices.length];
                const bassSeedIndex = Math.abs(bassNoteIndex) % 10; // Keep it low
                const bassSeed = SOUND_SEEDS[bassSeedIndex];

                // Sidechain feel: If it's a kick step (on beat), play quieter bass
                // If it's off-beat, play louder bass
                const isKickStep = step % 4 === 0;
                const bassVolume = isKickStep ? 0.03 : 0.08;

                triggerSound(ctx, bassSeed, startTime, bassVolume);
            }

            // 3. THE HI-HAT / PERCUSSION (16th notes)
            // Playing on the "and" and "e" and "a"
            // specifically highlight the off-beats (hi-hats)
            if (step % 4 === 2) {
                // Open Hi-hat feel: High frequency note
                const hatSeed = SOUND_SEEDS[45]; // High note
                triggerSound(ctx, hatSeed, startTime, 0.03);
            }
            if (step % 2 !== 0) {
                // Shaker feel: Very high, very quiet
                const shakerSeed = SOUND_SEEDS[48];
                triggerSound(ctx, shakerSeed, startTime, 0.02);
            }

            // 4. THE MELODY (Main Lead)
            // Dance music has repetitive hooks.
            // We'll Create a 2-bar loop (32 steps) that repeats but evolves slightly
            const loopStep = step % loopLength;

            // Syncopated pattern: 3-3-2 or similar
            // Let's determine play status based on the loop step to create a rhythm
            // e.g. Play on 0, 3, 6, 9, 12, 14...
            const pattern = [true, false, false, true, false, false, true, false, false, true, false, false, true, false, true, false]; // 16 step pattern approximation
            const shouldPlayMelody = pattern[loopStep % 16];

            if (shouldPlayMelody) {
                // Pick note from history
                // We use the full history array to give flavor
                const noteIndex = indices[step % indices.length];

                // Transpose to mid-high range for visibility
                let melodySeedIndex = (Math.abs(noteIndex) % 20) + 15; // Range 15-35

                // Variation: Every 4th bar, go higher
                if (Math.floor(step / 64) % 2 === 1) melodySeedIndex += 5;

                const melodySeed = SOUND_SEEDS[melodySeedIndex];
                triggerSound(ctx, melodySeed, startTime, 0.07);
            }

            // 5. THE FLOURISH (End of phrase fills)
            if (step % 64 > 56) {
                // Rising roll at end of 4 bars
                const rollIndex = 40 + (step % 8);
                const rollSeed = SOUND_SEEDS[rollIndex];
                triggerSound(ctx, rollSeed, startTime, 0.04);
            }
        }
    }, []);

    const playRandomSound = () => playNote();

    return { playNote, playSequence, playRandomSound };
};
