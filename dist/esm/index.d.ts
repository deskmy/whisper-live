declare enum Language {
    English = "en",
    French = "fr",
    Spanish = "es",
    German = "de",
    Italian = "it",
    Dutch = "nl",
    Russian = "ru",
    Mandarin = "zh",
    Japanese = "ja",
    Korean = "ko",
    Arabic = "ar",
    Hindi = "hi",
    Portuguese = "pt",
    Bengali = "bn",
    Persian = "fa",
    Turkish = "tr",
    Polish = "pl",
    Romanian = "ro",
    Swedish = "sv",
    Czech = "cs",
    Greek = "el",
    Danish = "da",
    Finnish = "fi",
    Hungarian = "hu",
    Indonesian = "id",
    Norwegian = "no",
    Thai = "th",
    Hebrew = "he",
    Ukrainian = "uk",
    Filipino = "tl",
    Vietnamese = "vi",
    Urdu = "ur",
    Malaysian = "ms",
    Bulgarian = "bg",
    Croatian = "hr",
    Estonian = "et",
    Icelandic = "is",
    Latvian = "lv",
    Lithuanian = "lt",
    Maltese = "mt",
    Slovak = "sk",
    Slovenian = "sl",
    Welsh = "cy",
    Serbian = "sr",
    Albanian = "sq",
    Armenian = "hy",
    Basque = "eu",
    Georgian = "ka",
    Yiddish = "yi"
}

type WhisperLiveConfig = {
    openAiKey: string;
    timeSlice?: number;
    model?: string;
    prompt?: string;
    language?: Language;
    onTranscript?: (transcription: string) => void;
};

declare class WhisperLive {
    private instance;
    constructor(config: WhisperLiveConfig);
    start(): void;
    stop(): Promise<string>;
    onTranscript(cb: (text: string) => void): void;
}

export { Language, WhisperLiveConfig, WhisperLive as default };
