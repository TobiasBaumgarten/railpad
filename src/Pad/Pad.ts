import Camera from "./Camera";
import GridDots from "./Sprites/GridDots";
import Node from "./Sprites/Node";
import { Input } from "./Input";
import { Drawable, NodeState, PadStyle, Vector } from "./models";
import Renderer from "./Renderer";
import NodeWarden from "./Sprites/NodeWarden";
import { ModeButtons, ModeButtonsState } from "./ModeButtons";

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
}

export default class Pad {
    parent: HTMLElement
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    nodes: Node[];
    camera: Camera;
    offsetNode: number = .00;
    input: Input;
    // style: PadStyle;
    lineColorMap: string[];
    renderer: Renderer;
    drawables: Drawable[];
    gridDots: GridDots;
    nodeWarden: NodeWarden;
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


    public get style() : PadStyle {
        return this.renderer.padStyle;
    }
    public set style(v : PadStyle) {
        this.renderer.padStyle = v;
    }
    
    constructor(element: HTMLElement, style: PadStyle = defaultStyle) {
        this.nodes = [];
        this.parent = element;
        this.canvas = document.createElement("canvas");
        this.parent.appendChild(this.canvas);
        this.canvas.id = "pad"
        this.ctx = this.canvas.getContext("2d")!;
        this.camera = new Camera(new Vector(0.4, 0));
        this.renderer = new Renderer(this.ctx, this.camera, style);
        this.width = this.parent.clientWidth;
        this.height = this.parent.clientHeight;
        console.log(this.parent.clientHeight)
        this.parent.addEventListener("resize", ev => {
            this.width = this.parent.clientWidth;
            this.height = this.parent.clientHeight;
        })
        this.initDrawables();
        this.inputHandlers();
        this.modeButtons = new ModeButtons(this.parent);
        this.modeButtons.onChange.add((s,d) => {
            console.log("TODO:", ModeButtonsState[d]);
        })
    }

    private inputHandlers() {
        this.input = new Input(this.canvas, this.camera);
        this.input.onMove.add((gp) => this.handleMove(gp));
        this.input.onWheel.add((_, ev) => this.handleWheel(ev));
        this.input.onClick.add((ev) => this.handleClick(ev));
        this.input.onMouseDown.add(ev => this.handleMouseDown(ev));
        this.input.onMouseUp.add(ev => this.handleMouseUp(ev))
    }

    private handleMouseUp(ev: MouseEvent): void {
        if (ev.button == 0) { // right Mouse button
            const selected = this.gridDots.selected();
            if (selected && this.nodeWarden.activeCreation) {
                this.nodeWarden.create(selected);
            }
            else if (this.nodeWarden.activeCreation) {
                this.nodeWarden.reset();
            }
        }
    }

    private handleMouseDown(ev: MouseEvent) {
        if (this.input.isMouseLeftDown) {
            const selected = this.gridDots.selected();
            if (selected) {
                this.nodeWarden.startCreate = selected;
                this.nodeWarden.activeCreation = true;
            }
        }
    }

    private handleClick(ev: MouseEvent) {

    }

    private handleMove(ev: MouseEvent) {
        // update the mouse position in GridDots
        this.gridDots.mouseGridPosition = this.input.currentGridPos!;
        // update the nodeWarden. He needs the information for the node creation process
        const selected = this.gridDots.selected();
        if (selected) this.nodeWarden.endCreate = selected;
        else this.nodeWarden.endCreate = this.input.currentGridPos!;

        // this.nodeWarden.endCreate = this.input.currentGridPos!;
        // this.nodeWarden.outSideCreationAllowed = this.gridDots.isMouseOverDot;
        if (this.input.isMouseRightDown) {
            this.camera.move(ev.movementX, ev.movementY);
        }
        if (this.input.isMouseLeftDown) {

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
        this.nodeWarden = new NodeWarden();
    }

    private draw() {
        this.renderer.clear(this.style.backgroundColor);
        this.nodeWarden.draw(this.renderer);
        this.gridDots.draw(this.renderer);
        this.drawables.forEach(d => d.draw(this.renderer));

    }

    public update() {
        this.draw();
    }

    public run(ticks = 20) {
        const milli = 1000 / ticks;
        setInterval(() => this.update(), milli);
    }


}