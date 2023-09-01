import { Vector } from "./Vector";

/**
 * This is a funktion that allows the user to download a file locally generated from the code.
 *
 * @example
 * const content = JSON.parse('{"Hello": "World!"}')
 * download(content, "example.json", "application/json")
 * // Fires a download for the user with a file that's named example.json
 *
 * @param content Content like ja json string
 * @param fileName A Name for the file
 * @param contentType The content type like json
 */
export function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

// Returns the current Mouse position on a given canvas.
export function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
}

/**
 * A Funktion thats prevents a recall of a funktion under a given time.
 * @param func A given Function
 * @param timeout time in ms
 * @returns void
 */
export function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

/**
 * Call a funktion after a given time.
 * @param milliseconds The time to sleep in ms
 * @returns Promise
 */
export function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * A class to implement an simple event system
 * 
 * @example 
 * class Button(){
 *  someValue = 0
 *  click = new Signal<Button, number>()>()
 * 
 *  onClick() {
 *      this.click.trigger(this, this.someValue)
 *  }
 * }
 * // and the subscription
 * const button = new Button()
 * button.click.add((btn, value) => console.log(value))
 */
export class Signal<S, T> {
    private handlers: Array<(source: S, data: T) => void> = [];

    /**
     * add a new handler to the Signal
     * @param handler Funktion thats has the Source and the data
     */
    public add(handler: (source: S, data: T) => void): void {
        this.handlers.push(handler);
    }

    /**
     * Removes a handler from the signal
     * @param handler Funktion thats hold the source an the data
     */
    public remove(handler: (source: S, data: T) => void): void {
        this.handlers = this.handlers.filter((h) => h !== handler);
    }

    /**
     * Triggers the event.
     * @param source The source object/class
     * @param data The data that should be delivered
     */
    public trigger(source: S, data: T): void {
        // Duplicate the array to avoid side effects during iteration.
        this.handlers.slice(0).forEach((h) => h(source, data));
    }
}

/**
 * A class to implement an simple event system without the source
 * 
 * @example 
 * class Button(){
 *  click = new Action<number>()>()
 * 
 *  onClick() {
 *      this.click.trigger(this.someValue)
 *  }
 * }
 * // and the subscription
 * const button = new Button()
 * button.click.add((value) => console.log(value))
 */
export class Action<T> {
    private handlers: Array<(data: T) => void> = [];

    public add(handler: (data: T) => void): void {
        this.handlers.push(handler);
    }

    public remove(handler: (data: T) => void): void {
        this.handlers = this.handlers.filter((h) => h !== handler);
    }

    public trigger(data: T): void {
        // Duplicate the array to avoid side effects during iteration.
        this.handlers.slice(0).forEach((h) => h(data));
    }
}

/**
 * A Timer class thats fires an Event after a given time.
 */
export default class Timer extends EventTarget {
    seconds = 0;
    constructor(seconds: number) {
        super();
        this.seconds = seconds;
    }

    private _complete: Event = new Event("complete");

    /**
     * Starts the timer
     */
    public start(): void {
        setTimeout(() => {
            this.dispatchEvent(this._complete);
        }, this.seconds * 1000);
    }
}

/**
 * Generate a guuid
 * @returns a guuid
 */
export function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
        S4() +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4()
    );
}
