import { WhisperLiveConfig } from "./types";
export declare class WhisperLive {
    private instance;
    constructor(config: WhisperLiveConfig);
    start(): void;
    stop(): Promise<string>;
    onTranscript(cb: (text: string) => void): void;
}
//# sourceMappingURL=WhisperLive.d.ts.map