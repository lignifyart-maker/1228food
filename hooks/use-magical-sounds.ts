import { useCallback, useEffect, useRef } from 'react';

// Chromatic Scale (12 semitones)
// C4 = 261.63 Hz
// We map octaves: Octave 4, 5, 6
const SCALE_FREQUENCIES = [
    // Octave 4: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
    261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88,
    // Octave 5
    523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77,
    // Octave 6
    1046.50, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98, 1661.22, 1760.00, 1864.66, 1975.53
];

const SOUND_SEEDS = Array.from({ length: 60 }, (_, i) => {
    // Map i to chromatic frequencies
    // Safe guard index
    const scaleIndex = i % SCALE_FREQUENCIES.length;
    const baseFreq = SCALE_FREQUENCIES[scaleIndex];

    // Minimal detune for warmth
    const detune = (Math.random() - 0.5) * 2;

    return {
        frequency: baseFreq + detune,
        type: (i % 3 === 0) ? 'triangle' : 'sine',
        duration: 0.8 + Math.random() * 0.5,
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

                const ctx = audioContextRef.current;
                compressorRef.current = ctx.createDynamicsCompressor();
                compressorRef.current.threshold.setValueAtTime(-24, ctx.currentTime);
                compressorRef.current.connect(ctx.destination);
            }
        }
    }, []);

    const triggerSound = (ctx: AudioContext, seed: typeof SOUND_SEEDS[0], startTime: number, volume = 0.05) => {
        const outputNode = compressorRef.current || ctx.destination;
        const masterGain = ctx.createGain();
        masterGain.connect(outputNode);

        masterGain.gain.setValueAtTime(0, startTime);
        masterGain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + seed.duration);

        const osc = ctx.createOscillator();
        osc.type = seed.type as OscillatorType;
        osc.frequency.setValueAtTime(seed.frequency, startTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, startTime);
        filter.frequency.exponentialRampToValueAtTime(3000, startTime + 0.05);
        filter.frequency.exponentialRampToValueAtTime(500, startTime + 0.3);

        osc.connect(filter);
        filter.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + seed.duration);
    };

    const playNote = useCallback((index?: number) => {
        if (!audioContextRef.current) return -1;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        const ctx = audioContextRef.current;

        // For random taps, prioritize Pentatonic/Diatonic notes to sound good
        // C Major Pentatonic indices in a Chromatic scale (0=C):
        // 0(C), 2(D), 4(E), 7(G), 9(A)
        const safeOffsets = [0, 2, 4, 7, 9];

        let seedIndex;
        if (index !== undefined) {
            // If specific index requested, assume it maps to our safe seeds
            seedIndex = Math.abs(index) % SOUND_SEEDS.length;
        } else {
            // Random tap: pick a safe offset + random octave
            const offset = safeOffsets[Math.floor(Math.random() * safeOffsets.length)];
            const octave = Math.floor(Math.random() * 3); // 0, 1, 2
            seedIndex = offset + (octave * 12);
        }

        const seed = SOUND_SEEDS[seedIndex];
        triggerSound(ctx, seed, ctx.currentTime, 0.1);
        return seedIndex;
    }, []);

    const playSequence = useCallback((indices: number[], durationSeconds: number = 30) => {
        if (!audioContextRef.current || indices.length === 0) return;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        const bpm = 130;
        const secondsPerBeat = 60 / bpm;
        const sixteenthNoteTime = secondsPerBeat / 4;
        const totalSteps = Math.floor(durationSeconds / sixteenthNoteTime);

        // --- 10 MELODY LIBRARY (Motifs) ---
        const SONGS = [
            {
                name: "My Grandfather's Clock",
                notes: [7, 12, 11, 12, 14, 16, 17, 16, null, 12, 14, 12, 11, 7, 9, 7],
                speed: 2
            },
            {
                name: "Nada Sousou (Tears)",
                notes: [0, 4, 5, 7, null, 7, 9, 7, null, 5, 4, 0, null, 2, 4, 2],
                speed: 2
            },
            {
                name: "La Marseillaise",
                notes: [7, 7, 12, 12, 7, 16, 17, 19, 17, 16, 14, 19, 12],
                speed: 2
            },
            {
                name: "ROC Anthem",
                notes: [0, 2, 4, 7, 9, 7, 4, 2, 0, 2, 4, 2, 0],
                speed: 4
            },
            {
                name: "March of the Volunteers",
                notes: [7, 4, 7, 7, 12, 7, 4, 0, 2, 7, 2, 0, 7, 0],
                speed: 2
            },
            {
                name: "The Star-Spangled Banner",
                notes: [7, 4, 0, 4, 7, 12, 19, 16, 14, 16, 14, 12, -5, 4, 7],
                speed: 2
            },
            {
                name: "Moonlight March",
                notes: [11, 9, 8, 9, 12, 9, 8, 9, 12, 14, 16, 14, 12, 11],
                speed: 1
            },
            {
                name: "Four Seasons (Spring)",
                notes: [4, 8, 8, 8, 4, 8, 8, 8, 4, 8, 11, 9, 8, 6, 4],
                speed: 2
            },
            {
                name: "Fur Elise",
                notes: [16, 15, 16, 15, 16, 11, 14, 12, 9, null, 0, 4, 9, 11],
                speed: 1
            },
            {
                name: "Anna Magdalena",
                notes: [14, 7, 9, 11, 12, 14, 7, 7, null, 16, 17, 16, 14, 12, 11],
                speed: 2
            }
        ];

        const selectedSong = SONGS[Math.floor(Math.random() * SONGS.length)];

        for (let step = 0; step < totalSteps; step++) {
            const startTime = now + (step * sixteenthNoteTime);

            // Structure: 0-30% Head, 30-85% Solo, 85-100% Reprise
            const progress = step / totalSteps;
            const isMainTheme = progress < 0.3 || progress > 0.85;

            // --- PHRASING & RESTS ---
            // Create "Breathing" moments.
            let isRest = false;

            // End of Bar Pause (every 16 steps)
            if (step % 16 === 15) isRest = true;

            // In Solo: Larger pauses to separate phrases
            if (!isMainTheme) {
                // Silence steps 28-31 of every 32-step block (Longer breath)
                if (step % 32 > 27) isRest = true;
            }

            if (isRest) continue; // Skip all generation for this step

            // --- 1. MELODY LAYER (Soprano) ---
            let melodyPlayed = false;
            let currentRootNote = 0; // Usage for harmony logic

            if (step % selectedSong.speed === 0) {
                let melodyNoteIndex = -999;
                let volume = 0.07;

                if (isMainTheme) {
                    const noteIndexInPattern = (step / selectedSong.speed) % selectedSong.notes.length;
                    const noteInterval = selectedSong.notes[noteIndexInPattern];
                    if (noteInterval !== null) {
                        melodyNoteIndex = noteInterval + 12; // Middle Octave
                        currentRootNote = noteInterval; // Store for harmony
                        if (noteIndexInPattern === 0) volume = 0.1;
                    }
                } else {
                    // Solo Phase
                    // Use history indices
                    const historyIndex = (step + Math.floor(step / 32)) % indices.length;
                    const rawSeed = indices[historyIndex];

                    // Safe intervals
                    const safeIntervals = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19];
                    const interval = safeIntervals[rawSeed % safeIntervals.length];
                    currentRootNote = interval;

                    // Rhythm Mask: Only play 60% of time in solo for "space"
                    if (Math.sin(step * 0.5) > -0.2) {
                        melodyNoteIndex = interval + 12;
                        // Variation: Octave jump
                        if (step % 8 === 0) melodyNoteIndex += 12;
                    }
                }

                if (melodyNoteIndex !== -999) {
                    const finalIndex = Math.max(0, Math.min(melodyNoteIndex, SOUND_SEEDS.length - 1));
                    triggerSound(ctx, SOUND_SEEDS[finalIndex], startTime, volume);
                    melodyPlayed = true;
                }
            }

            // --- 2. HARMONY LAYER (Alto/Tenor) ---
            // Plays polyphonic parts: 
            // - If Melody is silent (call-response)
            // - Or harmonizing (3rd/6th below) on strong beats

            const isHarmonyBeat = step % 4 === 2; // Off-beats or specific syncopation

            // In Theme: Support melody. In Solo: Dialogue.
            if (isHarmonyBeat && !melodyPlayed) {
                // Dialogue: Melody paused, Harmony answers
                // Pick a note from history related to current "Chord" (derived from step)
                const chordRoot = (Math.floor(step / 16) % 3) * 4; // Simple chord prog
                const harmonyIndex = indices[(step + 1) % indices.length];
                const offset = [0, 4, 7][harmonyIndex % 3]; // 1-3-5 chord tones

                let harmonyNote = chordRoot + offset + 12; // Mid octave

                const finalIndex = Math.max(0, Math.min(harmonyNote, SOUND_SEEDS.length - 1));
                triggerSound(ctx, SOUND_SEEDS[finalIndex], startTime, 0.04);
            }
            else if (step % 8 === 0 && melodyPlayed) {
                // Support: Play a 3rd below melody on downbeats
                let harmonyNote = currentRootNote + 12 - 4; // Roughly a major 3rd down
                const finalIndex = Math.max(0, Math.min(harmonyNote, SOUND_SEEDS.length - 1));
                triggerSound(ctx, SOUND_SEEDS[finalIndex], startTime, 0.03);
            }

            // --- 3. BASS LAYER (Bass) ---
            // Foundation. Playing less frequently to leave space?
            // Let's stick to downbeats but allow 8th note pickup
            if (step % 8 === 0 || (step % 16 === 14)) {
                const bassHistoryIndex = indices[Math.floor(step / 8) % indices.length];
                const safeBassOffsets = [0, 5, 7, 9]; // C, F, G, Am
                const bassOffset = safeBassOffsets[Math.abs(bassHistoryIndex) % safeBassOffsets.length];

                const bassVol = isMainTheme ? 0.1 : 0.08;
                triggerSound(ctx, SOUND_SEEDS[bassOffset], startTime, bassVol);
            }
        }
    }, []);

    const playRandomSound = () => playNote();

    return { playNote, playSequence, playRandomSound };
};
