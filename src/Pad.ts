import "./styles/styles.scss";

import Camera from "./Camera";
import NodeController from "./NodeController";
import Renderer from "./Renderer";
import { Vector } from "./Vector";
import { PadStyle } from "./models/PadStyle";
import mock from "./mock.json";
import { GridDotView } from "./GridDotView";
import { Input } from "./Input";
import {
    PaintModeButton,
    ModeButton,
    EditModeButton,
    ViewModeButton,
} from "./modeButtons";
import { Drawable, NodeModel } from "./models";
import { SaveModeButton } from "./modeButtons/SaveModeButton";

export default class {
    parent: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    camera: Camera;
    renderer: Renderer;
    nodeController: NodeController;
    gridDotView: GridDotView;
    input: Input;
    buttons: ModeButton[];
    drawables: Drawable[] = [];
    buttonGroupDiv: HTMLDivElement;

    constructor(id: string, style: PadStyle = defaultStyle) {
        const parent = document.getElementById(id);

        if (this.parent === null)
            throw new Error("There is no element with the id: " + id);
        this.parent = parent!;
        this.canvas = document.createElement("canvas");
        this.parent.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d")!;
        this.camera = new Camera(new Vector(0.4, 0));
        this.renderer = new Renderer(this.ctx, this.camera, style);
        this.width = 800;
        this.height = 600;

        this.gridDotView = new GridDotView();
        this.input = new Input(this.canvas, this.camera);

        this.dropJSON((data) => {
            this.nodeController.deserialize(data);
        });

        this.nodeController = new NodeController();
        // this.nodeController.deserialize(mock);
        this.createModeButtonDiv();
        this.inputHandlers();
    }

    private createModeButtonDiv() {
        this.buttons = [];
        this.buttonGroupDiv = document.createElement("div");
        this.buttonGroupDiv.classList.add("overlay");
        this.parent.appendChild(this.buttonGroupDiv);
        this.setUpModeButtons();
        this.buttons.forEach((b) => {
            b.button.addEventListener("click", (e) => {
                this.setActiveModeButton(b);
                if ("draw" in b) {
                    this.drawables.push(b as Drawable);
                }
            });
            this.buttonGroupDiv.appendChild(b.button!);
        });
    }

    private setActiveModeButton(button: ModeButton) {
        this.buttons.forEach((b) => {
            b.isActive = false;
        });
        button.isActive = true;
    }

    private setUpModeButtons() {
        this.buttons.push(new EditModeButton(this));
        this.buttons.push(new PaintModeButton(this));
        this.buttons.push(new ViewModeButton(this, true));
        this.buttons.push(new SaveModeButton(this));
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
        this.nodeController.draw(this.renderer);
        this.drawables.forEach((d) => d.draw(this.renderer));
        this.gridDotView.draw(this.renderer);
    }

    private inputHandlers() {
        this.input.onMove.add((gp) => this.handleMove(gp));
        this.input.onWheel.add((_, ev) => this.handleWheel(ev));
    }

    private handleMove(ev: MouseEvent) {
        // The camera movement
        if (this.input.isMouseRightDown) {
            this.camera.move(ev.movementX, ev.movementY);
        }
        this.gridDotView.mouseGridPosition = this.input.currentGridPos!;
    }

    private handleWheel(ev: WheelEvent) {
        // camera
        ev.preventDefault();
        const value = ev.deltaY > 1 ? 1 : -1;
        this.camera.zoom(value);
    }

    private dropJSON(callback: (data: NodeModel[]) => void) {
        // disable default drag & drop functionality
        this.canvas.addEventListener("dragenter", function (e) {
            e.preventDefault();
        });
        this.canvas.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        this.canvas.addEventListener("drop", function (event) {
            var reader = new FileReader();
            reader.onloadend = function () {
                var data = JSON.parse(this.result as string);
                callback(data);
            };

            reader.readAsText(event.dataTransfer!.files[0]);
            event.preventDefault();
        });
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
