import CameraView from "./Camera";
import { Action, getMousePos, Signal } from "./helper";
import { Vector } from "./Vector";

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
    // onZoom?: (ev: number) => void;

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

    private registerEventListener() {
        for (const key in this.eventListenerMap) {
            this.canvas.addEventListener(key, this.eventListenerMap[key]);
        }
    }

    private handleClick(ev: MouseEvent) {
        // this.handleMouseDown(ev);
        if (ev.button == 0) this.isMouseLeftDown = true;
        if (ev.button == 2) this.isMouseRightDown = true;
        this.onClick.trigger(ev);
        this.handleMouseUp(ev);
    }

    private handleMouseMove(ev: MouseEvent) {
        this.currentGridPos = this.camera.getGridPosition(
            getMousePos(this.canvas, ev)
        );
        this.onMove.trigger(ev);
        // if (this.isMouseLeftDown) {
        //     if (this.onMoveRight)
        //         this.onMoveRight(ev)
        // }
        // else if (this.isMouseRightDown) {
        //     this.pad.camera.move(ev.movementX, ev.movementY);
        // }
    }

    private handleContextMenu(ev: MouseEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        this.handleClick(ev);
    }

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

    // /** Return the Dot if the point intersects, else it returns undefined */
    // private pointDotIntersection(position: Vector, radius = 0.1): Vector | undefined {
    //     const xAbs = Math.abs(position.x % 1);
    //     const yAbs = Math.abs(position.y % 1);
    //     if ((xAbs < radius || xAbs > (1 - radius)) && (yAbs < radius || yAbs > (1 - radius))) {
    //         return position.round();
    //     }
    //     return undefined;
    // }
}
