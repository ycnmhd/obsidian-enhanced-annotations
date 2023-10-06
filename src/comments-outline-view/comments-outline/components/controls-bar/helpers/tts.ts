import CommentLabels from '../../../../../main';
import { visibleComments } from '../../../comments-list/comments-list.store';
import { Comment } from '../../../../helpers/update-comments-outline';

type Subscriber = (isReading: boolean) => void;

export class TTS {
    private static instance: TTS;
    private comments: Comment[];
    private plugin: CommentLabels;
    private isReadingPromise: null | Promise<boolean>;
    #isReading: boolean;
    private subscribers: Set<Subscriber> = new Set();
    private interval: ReturnType<typeof setInterval>;

    private constructor() {
        visibleComments.subscribe((v) => {
            this.comments = v;
        });
    }

    static getInstance() {
        if (!TTS.instance) {
            TTS.instance = new TTS();
        }
        return TTS.instance;
    }

    set setPlugin(value: CommentLabels) {
        this.plugin = value;
    }

    read() {
        const msg = new SpeechSynthesisUtterance();
        msg.text = this.comments.map((c) => c.text).join('.\n');
        const settings = this.plugin.settings.getValue().tts;
        msg.volume = settings.volume;
        msg.rate = settings.rate;
        msg.pitch = settings.pitch;
        msg.voice = window.speechSynthesis
            .getVoices()
            .filter((otherVoice) => otherVoice.name === settings.voice)[0];
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
        this.updateState();
    }

    stop() {
        window.speechSynthesis.cancel();
        this.updateState();
    }

    private updateState = () => {
        const isReading =
            window.speechSynthesis.speaking ||
            window.speechSynthesis.pending ||
            window.speechSynthesis.paused;
        this.#isReading = isReading;
        this.invokeSubscribers();
        if (isReading) {
            if (!this.isReadingPromise) {
                this.isReadingPromise = new Promise((res) => {
                    clearInterval(this.interval);
                    this.interval = setInterval(() => {
                        const isReading =
                            window.speechSynthesis.speaking ||
                            window.speechSynthesis.pending ||
                            window.speechSynthesis.paused;
                        if (!isReading) {
                            clearInterval(this.interval);
                            this.isReadingPromise = null;
                            res(isReading);
                        }
                    }, 250);
                });
            }
            this.isReadingPromise.finally(() => this.updateState());
        }
    };

    get isReading() {
        return this.#isReading;
    }

    subscribe(callback: Subscriber) {
        this.subscribers.add(callback);
        callback(this.isReading);
        return () => {
            this.subscribers.delete(callback);
        };
    }

    private invokeSubscribers() {
        this.subscribers.forEach((subscriber) => {
            subscriber(this.isReading);
        });
    }
}

export const tts = TTS.getInstance();
