import LabeledAnnotations from '../../../../../main';
import {
    activeAnnotationIndex,
    filteredBySearchAndCategoryAndLabel,
} from '../../annotations-list/annotations-list.store';
import { Annotation } from '../../../../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { selectText } from '../../annotations-list/helpers/focus-text';

type Subscriber = (isReading: boolean) => void;

export class TTS {
    private static instance: TTS;
    private annotations: Annotation[];
    private plugin: LabeledAnnotations;
    #isReading: boolean;
    private subscribers: Set<Subscriber> = new Set();
    private utterance: SpeechSynthesisUtterance;

    private constructor() {
        this.onLoad();
    }

    private onLoad() {
        filteredBySearchAndCategoryAndLabel.subscribe((v) => {
            this.annotations = v;
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

    set setPlugin(value: LabeledAnnotations) {
        this.plugin = value;
    }

    read() {
        const dict = this.annotations.reduce(
            (acc, v, i) => {
                acc.annotations[acc.c] = v;
                acc.c += v.text.length + 2;
                return acc;
            },
            { annotations: {} as Record<number, Annotation>, c: 0 },
        );
        this.utterance.text = this.annotations.map((c) => c.text).join('.\n');
        const settings = this.plugin.settings.getValue().tts;
        this.utterance.volume = settings.volume;
        this.utterance.rate = settings.rate;
        this.utterance.pitch = settings.pitch;
        this.utterance.voice = window.speechSynthesis
            .getVoices()
            .filter((otherVoice) => otherVoice.name === settings.voice)[0];
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(this.utterance);
        this.updateState();
        let annotationIndex = 0;
        this.utterance.onboundary = (e) => {
            if (e.name === 'sentence') {
                const annotation = dict.annotations[e.charIndex] as Annotation;
                if (annotation) {
                    if (settings.focusAnnotationInEditor)
                        selectText(annotation, this.plugin);
                    activeAnnotationIndex.set(annotationIndex++);
                }
            }
        };
    }

    stop() {
        window.speechSynthesis.cancel();
        this.updateState();
        activeAnnotationIndex.set(-1);
    }

    private updateState = () => {
        this.#isReading =
            window.speechSynthesis.speaking ||
            window.speechSynthesis.pending ||
            window.speechSynthesis.paused;
        if (!this.#isReading) activeAnnotationIndex.set(-1);
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
