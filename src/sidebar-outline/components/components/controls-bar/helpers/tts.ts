import LabeledAnnotations from '../../../../../main';
import {
    activeAnnotationIndex,
    filteredBySearchAndCategoryAndLabel,
} from '../../annotations-list/annotations-list.store';
import { Annotation } from '../../../../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { selectText } from '../../annotations-list/helpers/focus-text';
import { TFile } from 'obsidian';

type Subscriber = (isReading: boolean) => void;

export class TTS {
    private static instance: TTS;
    private annotations: Annotation[];
    private plugin: LabeledAnnotations;
    #isReading: boolean;
    private subscribers: Set<Subscriber> = new Set();
    private utterance: SpeechSynthesisUtterance;
    private activeTTSFile: TFile | null | undefined;
    private fileHasChanged = false;

    private constructor() {
        this.onLoad();
    }

    get isReading() {
        return this.#isReading;
    }

    static getInstance() {
        if (!TTS.instance) {
            TTS.instance = new TTS();
        }
        return TTS.instance;
    }

    setPlugin = (value: LabeledAnnotations) => {
        this.plugin = value;
        this.plugin.outline.subscribe((v) => {
            if (v.view?.file !== this.activeTTSFile) {
                this.fileHasChanged = true;
            } else {
                this.fileHasChanged = false;
            }
        });
    };

    read() {
        const dict = this.annotations.reduce(
            (acc, v, i) => {
                acc.annotations[acc.c] = v;
                acc.c += v.text.length + 2;
                return acc;
            },
            { annotations: {} as Record<number, Annotation>, c: 0 },
        );
        this.activeTTSFile = this.plugin.outline.getValue().view?.file;

        this.utterance.text = this.annotations.map((c) => c.text).join('.\n');
        const settings = this.plugin.settings.getValue().tts;
        this.utterance.volume = settings.volume;
        this.utterance.rate = settings.rate;
        this.utterance.pitch = settings.pitch;
        this.utterance.voice = window.speechSynthesis
            .getVoices()
            .filter((otherVoice) => otherVoice.name === settings.voice)[0];
        window.speechSynthesis.cancel();
        this.fileHasChanged = false;
        window.speechSynthesis.speak(this.utterance);
        this.updateState();
        let annotationIndex = 0;
        this.utterance.onboundary = (e) => {
            if (e.name === 'sentence') {
                const annotation = dict.annotations[e.charIndex] as Annotation;
                if (annotation) {
                    if (!this.fileHasChanged) {
                        if (settings.focusAnnotationInEditor)
                            selectText(annotation, this.plugin);
                        activeAnnotationIndex.set(annotationIndex);
                    } else {
                        activeAnnotationIndex.set(-1);
                    }
                    annotationIndex = annotationIndex + 1;
                }
            }
        };
    }

    stop() {
        window.speechSynthesis.cancel();
        this.updateState();
        activeAnnotationIndex.set(-1);
    }

    subscribe(callback: Subscriber) {
        this.subscribers.add(callback);
        callback(this.isReading);
        return () => {
            this.subscribers.delete(callback);
        };
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

    private updateState = () => {
        this.#isReading =
            window.speechSynthesis.speaking ||
            window.speechSynthesis.pending ||
            window.speechSynthesis.paused;
        if (!this.#isReading) activeAnnotationIndex.set(-1);
        this.invokeSubscribers();
    };

    private invokeSubscribers() {
        this.subscribers.forEach((subscriber) => {
            subscriber(this.isReading);
        });
    }
}

export const tts = TTS.getInstance();
