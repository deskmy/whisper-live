import axios from 'axios';
import { RecordRTCPromisesHandler } from 'recordrtc';
import EventEmitter from 'events';

const WHISPER_API_ENDPOINT = 'https://api.openai.com/v1/audio/transcriptions';
var EVENTS;
(function (EVENTS) {
    EVENTS["Transcribe"] = "Transcribe";
})(EVENTS || (EVENTS = {}));
var Language;
(function (Language) {
    Language["English"] = "en";
    Language["French"] = "fr";
    Language["Spanish"] = "es";
    Language["German"] = "de";
    Language["Italian"] = "it";
    Language["Dutch"] = "nl";
    Language["Russian"] = "ru";
    Language["Mandarin"] = "zh";
    Language["Japanese"] = "ja";
    Language["Korean"] = "ko";
    Language["Arabic"] = "ar";
    Language["Hindi"] = "hi";
    Language["Portuguese"] = "pt";
    Language["Bengali"] = "bn";
    Language["Persian"] = "fa";
    Language["Turkish"] = "tr";
    Language["Polish"] = "pl";
    Language["Romanian"] = "ro";
    Language["Swedish"] = "sv";
    Language["Czech"] = "cs";
    Language["Greek"] = "el";
    Language["Danish"] = "da";
    Language["Finnish"] = "fi";
    Language["Hungarian"] = "hu";
    Language["Indonesian"] = "id";
    Language["Norwegian"] = "no";
    Language["Thai"] = "th";
    Language["Hebrew"] = "he";
    Language["Ukrainian"] = "uk";
    Language["Filipino"] = "tl";
    Language["Vietnamese"] = "vi";
    Language["Urdu"] = "ur";
    Language["Malaysian"] = "ms";
    Language["Bulgarian"] = "bg";
    Language["Croatian"] = "hr";
    Language["Estonian"] = "et";
    Language["Icelandic"] = "is";
    Language["Latvian"] = "lv";
    Language["Lithuanian"] = "lt";
    Language["Maltese"] = "mt";
    Language["Slovak"] = "sk";
    Language["Slovenian"] = "sl";
    Language["Welsh"] = "cy";
    Language["Serbian"] = "sr";
    Language["Albanian"] = "sq";
    Language["Armenian"] = "hy";
    Language["Basque"] = "eu";
    Language["Georgian"] = "ka";
    Language["Yiddish"] = "yi";
})(Language || (Language = {}));

const AUDIO_MIME_TYPE = 'audio/webm;codecs=opus';
class WhisperLiveImpl {
    openAiKey;
    timeSlice;
    model;
    prompt;
    language;
    chunks = [];
    recorder;
    stream;
    recording = false;
    transcribing = false;
    transcript = '';
    events;
    constructor(config) {
        this.openAiKey = config.openAiKey;
        this.timeSlice = config.timeSlice ?? 2000;
        this.model = config.model ?? 'whisper-1';
        this.prompt = config.prompt ?? '';
        this.language = config.language ?? undefined;
        this.events = new EventEmitter();
    }
    startRecording = async () => {
        this.transcript = '';
        this.events.emit(EVENTS.Transcribe, '');
        await this.startStreaming();
        if (!this.recorder) {
            this.recorder = new RecordRTCPromisesHandler(this.stream, {
                mimeType: 'audio/webm',
                timeSlice: this.timeSlice,
                type: 'audio',
                ondataavailable: this.transcribe,
            });
        }
        const recordState = await this.recorder.getState();
        if (recordState === 'inactive' || recordState === 'stopped') {
            await this.recorder.startRecording();
        }
        if (recordState === 'paused') {
            await this.recorder.resumeRecording();
        }
        this.recording = true;
    };
    stopRecording = async () => {
        if (!this.recorder)
            return '';
        const state = await this.recorder.getState();
        if (state === 'recording' || state === 'paused') {
            await this.recorder.stopRecording();
        }
        this.recording = false;
        this.stopStreaming();
        await this.transcribe();
        await this.recorder.destroy();
        this.chunks = [];
        this.recorder = undefined;
        return this.transcript;
    };
    startStreaming = async () => {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        this.stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
    };
    stopStreaming = () => {
        if (!this.stream)
            return;
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = undefined;
    };
    transcribe = async (chunk) => {
        if (!this.recorder)
            return;
        this.transcribing = true;
        if (chunk) {
            this.chunks.push(chunk);
        }
        const blob = !chunk
            ? await this.recorder.getBlob()
            : new Blob(this.chunks, { type: AUDIO_MIME_TYPE });
        const file = new File([blob], 'speech.webm', { type: AUDIO_MIME_TYPE });
        const text = await this.sendToWhisper(file);
        this.transcript = text;
        this.transcribing = false;
        this.events.emit(EVENTS.Transcribe, text);
    };
    onTranscript = (cb) => {
        return this.events.on(EVENTS.Transcribe, cb);
    };
    sendToWhisper = async (file) => {
        const body = new FormData();
        body.append('file', file);
        body.append('model', this.model);
        if (this.language)
            body.append('language', this.language);
        if (this.prompt)
            body.append('prompt', this.prompt);
        const response = await axios.post(WHISPER_API_ENDPOINT, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${this.openAiKey}`,
            },
        });
        return response.data.text;
    };
}

class WhisperLive {
    instance;
    constructor(config) {
        this.instance = new WhisperLiveImpl(config);
    }
    start() {
        this.instance.startRecording();
    }
    stop() {
        return this.instance.stopRecording();
    }
    onTranscript(cb) {
        this.instance.onTranscript(cb);
    }
}

export { Language, WhisperLive as default };
