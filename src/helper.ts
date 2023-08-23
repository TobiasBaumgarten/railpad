import { Vector } from "./Vector";


export function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
}

export function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
   }

export class Signal<S, T> {
    private handlers: Array<(source: S, data: T) => void> = [];

    public add(handler: (source: S, data: T) => void): void {
        this.handlers.push(handler);
    }

    public remove(handler: (source: S, data: T) => void): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(source: S, data: T): void {
        // Duplicate the array to avoid side effects during iteration.
        this.handlers.slice(0).forEach(h => h(source, data));
    }
}

export class Action<T> {
    private handlers: Array<(data: T) => void> = [];

    public add(handler: (data: T) => void): void {
        this.handlers.push(handler);
    }

    public remove(handler: (data: T) => void): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(data: T): void {
        // Duplicate the array to avoid side effects during iteration.
        this.handlers.slice(0).forEach(h => h(data));
    }
}

export default class Timer extends EventTarget {
    seconds = 0;
    constructor(seconds: number) {
        super();
        this.seconds = seconds;
    }

    private _complete: Event = new Event('complete')

    public start(): void {
        setTimeout(() => {
            this.dispatchEvent(this._complete)
        }, this.seconds * 1000)
    }
}

export function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}