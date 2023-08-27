import Pad from "../Pad";
import Renderer from "../Renderer";
import { Vector } from "../Vector";
import { Drawable } from "../models";
import { ModeButton } from "./ModeButton";
// import eraserImage from ".././resources/eraser.png";

/**
 * Erzeugt, behinhaltet und vorallem controlt den Button für den Editiermodus und den Editermodus.
 *  */
export class EditModeButton extends ModeButton implements Drawable {
    aktiveCreation: boolean = false;
    startCreation: Vector | undefined;
    endCreation: Vector | undefined;
    validColor: string;
    deleteSwitch: HTMLButtonElement;
    switchDeleteText = ["Zeichnen", "Löschen"];
    deleteMode: boolean = false;
    eraserImage: HTMLImageElement;

    constructor(pad: Pad) {
        super(pad, "pen", false);
        this.deleteSwitch = Object.assign(document.createElement("button"), {
            className: "btn",
            textContent: this.switchDeleteText[0],
        });
        this.deleteSwitch.addEventListener("click", () =>
            this.switchDeleteMode()
        );
        this.controlDiv.appendChild(this.deleteSwitch);
        this.eraserImage = new Image();
        this.eraserImage.src = new URL(
            "../resources/eraser.png",
            import.meta.url
        ).toString();
    }

    private switchDeleteMode() {
        this.deleteMode = !this.deleteMode;
        if (!this.deleteSwitch) return;
        if (this.deleteMode) {
            this.deleteSwitch.textContent = this.switchDeleteText[1];
            this.pad.parent.classList.add("cursor-none");
        } else {
            this.deleteSwitch.textContent = this.switchDeleteText[0];
            this.pad.parent.classList.remove("cursor-none");
        }
    }

    setIsActive(v: boolean) {
        this.resetCreation();
    }

    resetCreation() {
        this.aktiveCreation = false;
        this.startCreation = undefined;
        this.endCreation = undefined;
        this.deleteMode = true;
        this.switchDeleteMode();
    }

    handleMouseDown(ev: MouseEvent): void {
        if (this.pad.input.isMouseLeftDown) {
            const selected = this.pad.gridDotView.selected();

            if (selected == null) return;

            if (this.deleteMode) {
                this.pad.nodeController.remove(selected);
                return;
            }

            if (!this.aktiveCreation) {
                this.aktiveCreation = true;
                this.startCreation = selected;
            } else {
                this.aktiveCreation = false;
                this.resetCreation();
            }
        }
    }

    handleMouseUp(ev: MouseEvent): void {
        if (this.startCreation && this.endCreation) {
            this.pad.nodeController.createLine(
                this.startCreation,
                this.endCreation
            );
        }
        if (!this.deleteMode) this.resetCreation();
    }
    handleClick(ev: MouseEvent): void {}

    handleMove(ev: MouseEvent): void {
        const selected = this.pad.gridDotView.selected();

        if (selected && this.startCreation) {
            this.endCreation = selected;
            const valid = this.pad.nodeController.isValidNeighbors(
                this.startCreation,
                this.endCreation
            );
            this.validColor = valid ? "green" : "red";
        } else {
            this.endCreation = this.pad.gridDotView.mouseGridPosition;
            this.validColor = "red";
        }
    }

    handleWheel(ev: WheelEvent): void {}

    draw(renderer: Renderer): void {
        this.drawEraser(renderer);
        if (this.startCreation == undefined || this.endCreation == undefined)
            return;
        renderer.drawLine(
            this.startCreation,
            this.endCreation,
            this.validColor
        );
    }

    private drawEraser(renderer: Renderer) {
        if (this.deleteMode) {
            const pos = this.pad.input.mousePosition;
            renderer.drawScreenImage(
                this.eraserImage,
                pos.x - 5,
                pos.y - 12,
                20,
                20
            );
        }
    }
}
