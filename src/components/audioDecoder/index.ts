export class AudioDecoder {
    private audioCtx: AudioContext = new AudioContext();
    private audioBuffer: AudioBuffer | null = null;
    private audioEl: HTMLAudioElement | null = null;

    private decodedArrayBuffer: Float32Array | null = null;

    public onLoadBuffer: Function | null = null;
    public onLoadError: (error: DOMException) => void | null = () => {
    };

    constructor(source?: string) {
        if (source) {
            this.openRemoteSource(source);
        }
    }

    openRemoteSource(source: string) {
        let req = new XMLHttpRequest();
        req.open('get', source);
        req.responseType = 'arraybuffer';
        req.send();
        req.onload = () => {
            this.audioCtx.decodeAudioData(req.response).then(audioBuffer => {
                this.audioBuffer = audioBuffer;
                this.decodeAudio();
                // TODO: 从 Buffer 生成 Audio
                // this.createAudioElement(req.response);
                if (this.onLoadBuffer) {
                    this.onLoadBuffer();
                }
            }).catch(e => {
                this.onLoadError(e);
            });
        }
    }

    private createAudioElement(arrBuf: ArrayBuffer) {
        let blob = new Blob([arrBuf], {type: 'audio/wave'});
        let src = URL.createObjectURL(blob);
        this.audioEl = new HTMLAudioElement();
        this.audioEl.src = src;
    }

    getAudioElement() {
        if(this.audioEl) {
            return this.audioEl;
        }
    }

    decodeAudio() {
        if (this.audioBuffer) {
            let result: number[] = [];
            if (this.audioBuffer) {
                this.decodedArrayBuffer = this.audioBuffer.getChannelData(0);
            }
            return result;
        } else {
            console.error('Audio is not loaded.');
            return [];
        }
    }

    getDecodedArray(width: number, height: number): number[] {
        let result: number[] = [];
        if (this.audioBuffer && this.decodedArrayBuffer) {
            let step = Math.ceil(this.decodedArrayBuffer.length / width);
            for (let i = 0; i < width; i++) {
                let value = 0;
                for (let j = 0; j < step; j++) {
                    let currentValue = this.decodedArrayBuffer[i * step + j];
                    if (currentValue > value) {
                        value = currentValue;
                    }
                }
                let pixelHeight = parseInt((value * height).toFixed());
                if (pixelHeight < 5) {
                    pixelHeight += 5
                }
                result.push(pixelHeight);
            }
        }
        return result;
    }

}


export default AudioDecoder;
