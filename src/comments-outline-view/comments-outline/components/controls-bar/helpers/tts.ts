import CommentLabels from '../../../../../main';
import {
    activeCommentIndex,
    visibleComments,
} from '../../comments-list/comments-list.store';
import { ParsedComment } from '../../../../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';
import { selectText } from '../../comments-list/helpers/focus-text';

type Subscriber = (isReading: boolean) => void;

export class TTS {
    private static instance: TTS;
    private comments: ParsedComment[];
    private plugin: CommentLabels;
    #isReading: boolean;
    private subscribers: Set<Subscriber> = new Set();
    private utterance: SpeechSynthesisUtterance;

    private constructor() {
        this.onLoad();
    }

    private onLoad() {
        visibleComments.subscribe((v) => {
            this.comments = v;
        });
        this.utterance = new SpeechSynthesisUtterance();
        this.utterance.onpause = this.updateState;
        this.utterance.onend = this.updateState;
        this.utterance.onstart = this.updateState;
        this.utterance.onresume = this.updateState;
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
        const commentsDictionary = this.comments.reduce(
            (acc, v, i) => {
                acc.comments[acc.c] = v;
                acc.c += v.text.length + 2;
                return acc;
            },
            { comments: {} as Record<number, ParsedComment>, c: 0 },
        );
        this.utterance.text = this.comments.map((c) => c.text).join('.\n');
        const settings = this.plugin.settings.getValue().tts;
        this.utterance.volume = settings.volume;
        this.utterance.rate = settings.rate;
        this.utterance.pitch = settings.pitch;
        this.utterance.voice = window.speechSynthesis
            .getVoices()
            .filter((otherVoice) => otherVoice.name === settings.voice)[0];
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(this.utterance);

        let commentIndex = 0;
        this.utterance.onboundary = (e) => {
            if (e.name === 'sentence') {
                const comment = commentsDictionary.comments[
                    e.charIndex
                ] as ParsedComment;
                if (comment) {
                    if (settings.focusCommentInEditor)
                        selectText(comment, this.plugin);
                    activeCommentIndex.set(commentIndex++);
                }
            }
        };
    }

    stop() {
        window.speechSynthesis.cancel();
        this.updateState();
        activeCommentIndex.set(-1);
    }

    private updateState = () => {
        this.#isReading =
            window.speechSynthesis.speaking ||
            window.speechSynthesis.pending ||
            window.speechSynthesis.paused;
        this.invokeSubscribers();
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
