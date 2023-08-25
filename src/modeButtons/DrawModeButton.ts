import Pad from "../Pad";
import { ModeButton } from "./ModeButton";

/**
 * Contains, create the PaintMode Button and especially handels the paint mode 
 */
export class PaintModeButton extends ModeButton {
    picker: HTMLInputElement;
    color: string;

    constructor(pad: Pad) {
        super(pad, "brush");
        this.picker = document.createElement("input");
        this.picker.type = "color";
        this.picker.className = "picker";
        pad.parent.appendChild(this.picker);
        this.picker.addEventListener("change", (ev) => {
            this.color = this.picker.value;  
            console.log(this.color);
                     
        })
        this.resetVisibility();
    }

    public set isActive(v: boolean) {
        this.setIsActive(v);
        this.resetVisibility();
    }

    private resetVisibility() {
        if (this.picker == undefined) return;
        console.log("HEy");

        this.picker.style.visibility = this._isActive ? "visible" : "hidden";
    }

    handleMouseDown(ev: MouseEvent): void {}
    handleMouseUp(ev: MouseEvent): void {}
    handleClick(ev: MouseEvent): void {}
    handleMove(ev: MouseEvent): void {}
    handleWheel(ev: WheelEvent): void {}
}
