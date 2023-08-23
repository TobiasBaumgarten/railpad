import Camera from "./Camera";
import NodeController from "./NodeController";
import Renderer from "./Renderer";
import { Vector } from "./Vector";
import { PadStyle } from "./models/PadStyle";
import mock from "./mock.json";
import { GridDotView } from "./GridDotView";
import { Input } from "./Input";
import { ModeButtons, ModeButtonsState } from "./ModeButtons";
import "./styles/styles.scss";

export default class {
    parent: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    camera: Camera;
    renderer: Renderer;
    nodeController: NodeController;
    gridDotView: GridDotView;
    input: Input;
    modeButtons: ModeButtons;
    aktiveCreation: any;
    startCreation: Vector | null;

    constructor(id: string, style: PadStyle = defaultStyle) {
        const parent = document.getElementById(id);
        console.log(parent);

        if (this.parent === null)
            throw new Error("There is no element with the id: " + id);
        this.parent = parent!;
        this.canvas = document.createElement("canvas");
        this.parent.appendChild(this.canvas);
        // this.canvas.id = "pad";
        this.ctx = this.canvas.getContext("2d")!;
        this.camera = new Camera(new Vector(0.4, 0));
        this.renderer = new Renderer(this.ctx, this.camera, style);
        this.width = 800;
        this.height = 600;

        this.gridDotView = new GridDotView();

        this.nodeController = new NodeController();
        this.nodeController.deserialize(mock);

        this.modeButtons = new ModeButtons(this.parent);
        this.modeButtons.onChange.add((s, d) => {
            console.log("TODO:", ModeButtonsState[d]);
        });

        this.inputHandlers();
    }

    public get width(): number {
        return this.canvas.width;
    }
    public set width(v: number) {
        this.canvas.width = v;
        this.camera.width = v;
    }

    public get height(): number {
        return this.canvas.height;
    }
    public set height(v: number) {
        this.canvas.height = v;
        this.camera.height = v;
    }

    public run(ticks = 20) {
        const milli = 1000 / ticks;
        setInterval(() => this.update(), milli);
    }

    update() {
        this.renderer.clear(this.renderer.padStyle.backgroundColor);
        this.gridDotView.draw(this.renderer);
        this.nodeController.draw(this.renderer);

        // this.gridDots.draw(this.renderer);
        // this.drawables.forEach((d) => d.draw(this.renderer));
    }

    private inputHandlers() {
        this.input = new Input(this.canvas, this.camera);
        this.input.onMove.add((gp) => this.handleMove(gp));
        this.input.onWheel.add((_, ev) => this.handleWheel(ev));
        this.input.onClick.add((ev) => this.handleClick(ev));
        this.input.onMouseDown.add((ev) => this.handleMouseDown(ev));
        this.input.onMouseUp.add((ev) => this.handleMouseUp(ev));
    }

    private handleMouseDown(ev: MouseEvent): void {
        switch (this.modeButtons.state) {
            case ModeButtonsState.edit:
                this.handleMouseDownEditMode();
                break;
            case ModeButtonsState.delete:
                break;
            case ModeButtonsState.label:
                break;

            default: //view
                break;
        }
    }

    private handleMouseUp(ev: MouseEvent): void {
        switch (this.modeButtons.state) {
            case ModeButtonsState.edit:
                this.handleMouseUpEditMode();
                break;
            case ModeButtonsState.delete:
                break;
            case ModeButtonsState.label:
                break;

            default: //view
                break;
        }
        if (ev.button == 0) {
            // right Mouse button
        }
    }

    private handleMouseUpEditMode() {
        const selected = this.gridDotView.selected();
        // if (selected && this.nodeWarden.activeCreation) {
        //     this.nodeWarden.create(selected);
        // } else if (this.nodeWarden.activeCreation) {
        //     this.nodeWarden.resetCreate();
        // }
    }

    private handleClick(ev: MouseEvent) {
        switch (this.modeButtons.state) {
            case ModeButtonsState.edit:
                // Nothing
                break;
            case ModeButtonsState.delete:
                const selected = this.gridDotView.selected();
                if (selected) {
                    // remove
                    // this.nodeWarden.remove(selected);
                    console.log("Deke");
                }
                break;
            case ModeButtonsState.label:
                break;

            default: //view
                break;
        }
    }

    private handleMove(ev: MouseEvent) {
        // The camera movement
        if (this.input.isMouseRightDown) {
            this.camera.move(ev.movementX, ev.movementY);
        }

        // update the mouse position in GridDots
        this.gridDotView.mouseGridPosition = this.input.currentGridPos!;

        switch (this.modeButtons.state) {
            case ModeButtonsState.edit:
                // update the nodeWarden. He needs the information for the node creation process
                const selected = this.gridDotView.selected();
                // if (selected) this.nodeWarden.endCreate = selected;
                // else this.nodeWarden.endCreate = this.input.currentGridPos!;
                break;

            case ModeButtonsState.delete:
                break;
            case ModeButtonsState.label:
                break;

            default: //view
                break;
        }
    }

    private handleWheel(ev: WheelEvent) {
        ev.preventDefault();
        const value = ev.deltaY > 1 ? 1 : -1;
        this.camera.zoom(value);
    }

    private handleMouseDownEditMode() {
        if (this.input.isMouseLeftDown) {
            const selected = this.gridDotView.selected();

            if (selected) {
                if (!this.aktiveCreation) {
                    console.log(selected);
                    this.aktiveCreation = true;
                    this.startCreation = selected;
                } else {
                    this.aktiveCreation = false;
                    this.nodeController.createLine(
                        this.startCreation!,
                        selected
                    );
                    this.startCreation = null;
                }
                // this.nodeWarden.startCreate = selected;
                // this.nodeWarden.activeCreation = true;
            }
        }
    }
}

const defaultStyle: PadStyle = {
    backgroundColor: "white",
    dotColor: "pink",
    dotHoverColor: "red",
    dotSelectColor: "red",
    nodeLineDefault: "black",
    nodeLineDeconstruct: "orange",
    nodeLineBuild: "red",
    nodeLineBuilded: "green",
    nodeLineGhost: "gray",
};
