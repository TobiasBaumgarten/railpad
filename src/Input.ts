import CameraView from "./Camera";
import { Action, getMousePos, Signal } from "./helper";
import { Vector } from "./Vector";

/**
 * Adapter for the user input and the input computing in the app
 */
export class Input {
    private canvas: HTMLCanvasElement;
    camera: CameraView;
    isMouseLeftDown: boolean = false;
    isMouseRightDown: boolean = false;
    dotSelected: Vector | undefined = undefined;
    currentGridPos: Vector | undefined;
    onMove = new Action<MouseEvent>();
    onWheel = new Signal<Input, WheelEvent>();
    onMouseDown = new Action<MouseEvent>();
    onMouseUp = new Action<MouseEvent>();
    onClick = new Action<MouseEvent>();
    mousePosition: Vector;
    // onZoom?: (ev: number) => void;

    /** A map of all used events in the app that should be registert */
    private eventListenerMap = {
        mousemove: (ev) => this.handleMouseMove(ev),
        contextmenu: (ev) => this.handleContextMenu(ev),
        mousedown: (ev) => this.handleMouseDown(ev),
        mouseup: (ev) => this.handleMouseUp(ev),
        wheel: (ev) => this.onWheel.trigger(this, ev),
        click: (ev) => this.handleClick(ev),
    };

    constructor(canvas: HTMLCanvasElement, camera: CameraView) {
        this.canvas = canvas;
        this.camera = camera;
        this.registerEventListener();
    }

    /**
     * Responsable for registration of the event listender
     */
    private registerEventListener() {
        for (const key in this.eventListenerMap) {
            this.canvas.addEventListener(key, this.eventListenerMap[key]);
        }
    }

    /**
     * handles the mouse glick
     * @param ev MouseEvent
     */
    private handleClick(ev: MouseEvent) {
        // this.handleMouseDown(ev);
        if (ev.button == 0) this.isMouseLeftDown = true;
        if (ev.button == 2) this.isMouseRightDown = true;
        this.onClick.trigger(ev);
        this.handleMouseUp(ev);
    }

    /**
     * handels the mouse move
     * @param ev MouseEvent
     */
    private handleMouseMove(ev: MouseEvent) {
        this.mousePosition = getMousePos(this.canvas, ev);
        this.currentGridPos = this.camera.getGridPosition(this.mousePosition);
        this.onMove.trigger(ev);
        // if (this.isMouseLeftDown) {
        //     if (this.onMoveRight)
        //         this.onMoveRight(ev)
        // }
        // else if (this.isMouseRightDown) {
        //     this.pad.camera.move(ev.movementX, ev.movementY);
        // }
    }

    /**
     * handels the context menu
     * @param ev MouseEvent
     */
    private handleContextMenu(ev: MouseEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        this.handleClick(ev);
    }

    /**
     * Handels the MouseUp event
     * @param ev MouseEvent
     */
    private handleMouseUp(ev: MouseEvent) {
        // ev.preventDefault();
        if (ev.button === 0) {
            // Mouse down left
        } else if (ev.button == 2) {
            // mouse down right
        }
        this.isMouseLeftDown = false;
        this.isMouseRightDown = false;
        this.onMouseUp.trigger(ev);
    }

    /**
     * Handels the MouseDown event
     * @param ev MouseEvent
     */
    private handleMouseDown(ev: MouseEvent) {
        if (ev.button === 0) {
            // Mouse down left
            this.isMouseLeftDown = true;
        } else if (ev.button == 2) {
            // mouse down right
            this.isMouseRightDown = true;
        }
        this.onMouseDown.trigger(ev);
    }
}
