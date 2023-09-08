import Pad from "../Pad";
import Node from "../Node";
import { ModeButton } from "./ModeButton";
import { Colorpicker } from "../Colorpicker"
// @ts-ignore
import myTemplate from "bundle-text:./DrawModePallet.html";
import colorpallet from "../assets/colorpallet.json"

/**
 * Contains, create the PaintMode Button and especially handels the paint mode
 */
export class PaintModeButton extends ModeButton {
    picker: HTMLInputElement;
    colorPicker: Colorpicker
    color: string = "rgb(0,0,0)";
    controlDiv: HTMLDivElement;
    switchDelete: HTMLButtonElement;
    switchLine: HTMLButtonElement;
    deleteMode: boolean = false;
    backLineMode: boolean = false;

    switchDeleteText = ["Zeichnen", "Löschen"];
    switchLineText = ["Linie", "Hintergrund"];

    constructor(pad: Pad) {
        super(pad);
        this.controlDiv.innerHTML = myTemplate;

        // picker
        this.picker = this.controlDiv.querySelector("#picker")!;
        this.colorPicker = new Colorpicker(this.picker, colorpallet);
        this.colorPicker.onChange.add((_, color) => {
            console.log(color);
        })
        // this.picker = this.controlDiv.querySelector("#picker")!;
        // this.picker.value = this.color;
        // this.picker.addEventListener("change", (ev) => {
        //     this.color = this.picker.value;
        // });

        // Delete switch
        this.switchDelete = this.controlDiv.querySelector("#switchDelete")!;
        this.switchDelete.textContent = this.switchDeleteText[0];
        this.switchDelete.addEventListener("click", (ev) => {
            this.deleteMode = !this.deleteMode;
            const index = this.deleteMode ? 1 : 0;
            this.switchDelete.textContent = this.switchDeleteText[index];
        });
        this.switchDelete.style.visibility = "hidden";

        // Line switch
        this.switchLine = this.controlDiv.querySelector("#switchLine")!;
        this.switchLine.textContent = this.switchLineText[0];
        this.switchLine.addEventListener("click", (ev) => {
            this.backLineMode = !this.backLineMode;
            const index = this.backLineMode ? 1 : 0;
            this.switchLine.textContent = this.switchLineText[index];
            this.switchDelete.style.visibility = this.backLineMode
                ? "visible"
                : "hidden";
        });
    }

    changeColor(node: Node) {
        if (this.backLineMode) {
            node.backColor = this.deleteMode ? undefined : this.color;
        } else {
            node.lineColor = this.color;
        }
        console.log(node.backColor);

    }

    setIsActive(v: boolean) { }

    handleMouseDown(ev: MouseEvent): void { }
    handleMouseUp(ev: MouseEvent): void { }
    handleClick(ev: MouseEvent): void {
        const selected = this.pad.gridDotView.selected();
        if (!selected) return;
        const node = this.pad.nodeController.get(selected);
        if (!node) return;
        this.changeColor(node);
    }
    handleMove(ev: MouseEvent): void { }
    handleWheel(ev: WheelEvent): void { }
}
