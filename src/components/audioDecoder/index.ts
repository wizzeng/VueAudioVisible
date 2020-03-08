export class AudioDecoder {
    private audioCtx: AudioContext = new AudioContext();
    private audioBuffer: AudioBuffer | null = null;

    public onLoadBuffer: Function | null = null;
    public onLoadError: (error: DOMException) => void | null = () => {};

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
                if (this.onLoadBuffer) {
                    this.onLoadBuffer();
                }
            }).catch(e => {
                this.onLoadError(e);
            });
        }
    }

    getDecodedArray(width: number, height: number): number[] {
        if (this.audioBuffer) {
            let result: number[] = [];
            if (this.audioBuffer) {
                let data = this.audioBuffer.getChannelData(0);
                let step = Math.ceil(data.length / width);
                for (let i = 0; i < width; i++) {
                    let value = 0;
                    for (let j = 0; j < step; j++) {
                        let currentValue = data[i * step + j];
                        if (currentValue > value) {
                            value = currentValue;
                        }
                    }
                    let pixelHeight = parseInt((value * height * 0.8).toFixed());
                    if(pixelHeight < 5) {
                        pixelHeight += 5
                    }
                    result.push(pixelHeight);
                }
            }
            return result;
        } else {
            console.error('Audio is not loaded.');
            return [];
        }

    }


}


export default AudioDecoder;
