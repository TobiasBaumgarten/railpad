import Node from "../Node";
import Renderer from "../Renderer";
import { Drawable } from "../models";
import { ModeButton } from "./ModeButton";
//@ts-ignore
import labelSVG from "bundle-text:../assets/label.svg";


export class LabelModeButton extends ModeButton implements Drawable {
    activeNode?: Node;
    mask: HTMLDivElement;
    inDesk: HTMLInputElement;

    constructor(pad) {
        super(pad);
        this.button.innerHTML = labelSVG;
        this.controlDiv.innerHTML = `
        <div id="mask">
            <input id="inDesk" type="number"/>
        </div>
        `;
        this.mask = this.controlDiv.querySelector("#mask")!;
        this.inDesk = this.controlDiv.querySelector("#inDesk")!;

        this.mask.className = "hidden";

        this.inDesk.addEventListener("change", (ev) => {
            if (this.activeNode) {
                this.activeNode.description =
                    this.inDesk.value != "" ? parseInt(this.inDesk.value) : undefined;
            }
        });
    }
    setIsActive(v: boolean) {
        this.activeNode = undefined;
    }
    handleMouseDown(ev: MouseEvent): void {}
    handleMouseUp(ev: MouseEvent): void {}

    handleClick(ev: MouseEvent): void {
        const selected = this.pad.gridDotView.selected();
        if (selected) {
            this.activeNode = this.pad.nodeController.get(selected.round());
            if (this.activeNode) {
                this.mask.classList.remove("hidden");
                this.slectedNode();
            }
        } else {
            this.activeNode = undefined;
            this.mask.classList.add("hidden");
        }
    }
    slectedNode() {
        this.inDesk.value = this.activeNode?.description?.toString() || "";
    }
    handleMove(ev: MouseEvent): void {}
    handleWheel(ev: WheelEvent): void {}

    draw(renderer: Renderer) {
        if (this.activeNode) {
            renderer.drawDot(0.5, this.activeNode, "rgba(255,182,193,0.5)");
        }
    }
}
