import Pad from "../Pad";
import Node from "../Node";
import { ModeButton } from "./ModeButton";
import { Colorpicker } from "../Colorpicker"
// @ts-ignore
import myTemplate from "bundle-text:./DrawModePallet.html";
// @ts-ignore
import drawIcon from "bundle-text:../assets/icons/paint.svg";
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
    switchthinLine: HTMLButtonElement;
    switchthickLine: HTMLButtonElement;
    deleteMode: boolean = false;
    backLineMode: boolean = false;

    switchDeleteText = ["Zeichnen", "Löschen"];
    switchLineText = ["Linie", "Hintergrund"];

    constructor(pad: Pad) {
        super(pad);
        this.controlDiv.innerHTML = myTemplate;

        this.button.innerHTML = drawIcon;

        //picker 
        this.picker = this.controlDiv.querySelector("#picker")!;
        this.colorPicker = new Colorpicker(this.picker as HTMLButtonElement, this.controlDiv, colorpallet);
        this.colorPicker.onChange.add((_, color) => {
            this.color = color;
        })


        //Delete switch
        this.switchDelete = this.controlDiv.querySelector("#delete")!;
        this.switchDelete.addEventListener("click", (ev) => {
            this.deleteMode = true;
            this.switchDelete.classList.add("active");
        });

        // thick line switch
        this.switchthickLine = this.controlDiv.querySelector("#thick")!;
        this.switchthickLine.addEventListener("click", (ev) => {
            this.deleteMode = false;
            this.backLineMode = true;
            this.switchthickLine.classList.add("active");
            this.switchthinLine.classList.remove("active");
            this.switchDelete.classList.remove("active");
        });
    
        // thin line switch
        this.switchthinLine = this.controlDiv.querySelector("#thin")!;
        this.switchthinLine.addEventListener("click", (ev) => {
            this.deleteMode = false;
            this.backLineMode = false;
            this.switchthinLine.classList.add("active");
            this.switchthickLine.classList.remove("active");
            this.switchDelete.classList.remove("active");
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
