import Camera from "./Camera";
import GridDots from "./Sprites/GridDots";
import Node from "./Sprites/Node";
import { Input } from "./Input";
import { Drawable, PadStyle } from "./models";
import Renderer from "./Renderer";
import NodeWarden from "./Sprites/NodeWarden";
import { ModeButtons, ModeButtonsState } from "./ModeButtons";
import { Vector } from "./Vector";
import { NodeMapController } from "./NodeMapController";
import NodeView from "../View/NodeView";
import NodeModel from "../Model/NodeModel";

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

export default class Pad {
    parent: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    nodes: Node[];
    camera: Camera;
    offsetNode: number = 0.0;
    input: Input;
    // style: PadStyle;
    lineColorMap: string[];
    renderer: Renderer;
    drawables: Drawable[];
    gridDots: GridDots;
    nodeView: NodeView;
    nodeModel: NodeModel;
    // nodeWarden: NodeWarden;
    // nodeMapController: NodeMapController;
    modeButtons: ModeButtons;

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

    public get style(): PadStyle {
        return this.renderer.padStyle;
    }
    public set style(v: PadStyle) {
        this.renderer.padStyle = v;
    }

    constructor(element: HTMLElement, style: PadStyle = defaultStyle) {
        this.nodes = [];
        this.parent = element;
        this.canvas = document.createElement("canvas");
        this.parent.appendChild(this.canvas);
        // this.canvas.id = "pad";
        this.ctx = this.canvas.getContext("2d")!;
        this.camera = new Camera(new Vector(0.4, 0));
        this.renderer = new Renderer(this.ctx, this.camera, style);
        this.width = this.parent.clientWidth;
        this.height = this.parent.clientHeight;
        new ResizeObserver(() => {
            this.width = this.parent.clientWidth;
            this.height = this.parent.clientHeight;
        }).observe(this.parent);


        this.nodeModel = new NodeModel();
        this.nodeModel.addNodeAndNeighbors({x:0,y:0},{x:1,y:0},{x:-1,y:0})
        this.nodeModel.addNodeAndNeighbors({x:1,y:0},{x:0,y:0},{x:2,y:0})


        this.initDrawables();
        this.inputHandlers();
        // this.nodeMapController = new NodeMapController(this.nodeWarden);
        this.modeButtons = new ModeButtons(this.parent);
        this.modeButtons.onChange.add((s, d) => {
            console.log("TODO:", ModeButtonsState[d]);
        });
    }

    // public createMap(name:string) {
    //     this.nodeMapController.createNewMap(name);
    // }

    private inputHandlers() {
        this.input = new Input(this.canvas, this.camera);
        this.input.onMove.add((gp) => this.handleMove(gp));
        this.input.onWheel.add((_, ev) => this.handleWheel(ev));
        this.input.onClick.add((ev) => this.handleClick(ev));
        this.input.onMouseDown.add((ev) => this.handleMouseDown(ev));
        this.input.onMouseUp.add((ev) => this.handleMouseUp(ev));
    }

    //#region handleMouseDown

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

    private handleMouseDownEditMode() {
        if (this.input.isMouseLeftDown) {
            const selected = this.gridDots.selected();
            if (selected) {
                // this.nodeWarden.startCreate = selected;
                // this.nodeWarden.activeCreation = true;
            }
        }
    }

    //#endregion

    //#region handleMouseUp

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
        const selected = this.gridDots.selected();
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
                const selected = this.gridDots.selected();
                if(selected) {
                    // remove
                    // this.nodeWarden.remove(selected);
                    console.log("Deke")
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
        this.gridDots.mouseGridPosition = this.input.currentGridPos!;

        switch (this.modeButtons.state) {
            case ModeButtonsState.edit:
                // update the nodeWarden. He needs the information for the node creation process
                const selected = this.gridDots.selected();
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

    private initDrawables() {
        this.drawables = [];
        this.gridDots = new GridDots();
        this.nodeView = new NodeView(this.renderer)
    }

    private draw() {
        //setup
        this.gridDots.viewDots =
            this.modeButtons.state != ModeButtonsState.view;
        // draw
        this.renderer.clear(this.style.backgroundColor);
        this.nodeView.draw(this.nodeModel.nodes);
        this.gridDots.draw(this.renderer);
        this.drawables.forEach((d) => d.draw(this.renderer));
    }

    public update() {
        this.draw();
    }

    public run(ticks = 20) {
        const milli = 1000 / ticks;
        setInterval(() => this.update(), milli);
    }
}
