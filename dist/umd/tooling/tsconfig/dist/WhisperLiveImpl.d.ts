/// <reference types="node" />
import { RecordRTCPromisesHandler } from 'recordrtc';
import { WhisperLiveConfig } from './types';
import EventEmitter from 'events';
export declare class WhisperLiveImpl {
    openAiKey: string;
    timeSlice: number;
    model: string;
    prompt: string;
    language: string | undefined;
    chunks: Blob[];
    recorder?: RecordRTCPromisesHandler;
    stream?: MediaStream;
    recording: boolean;
    transcribing: boolean;
    transcript: string;
    events: EventEmitter;
    constructor(config: WhisperLiveConfig);
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<string>;
    startStreaming: () => Promise<void>;
    stopStreaming: () => void;
    transcribe: (chunk?: Blob) => Promise<void>;
    onTranscript: (cb: (text: string) => void) => EventEmitter;
    sendToWhisper: (file: File) => Promise<string>;
}
//# sourceMappingURL=WhisperLiveImpl.d.ts.map