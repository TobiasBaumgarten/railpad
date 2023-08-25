import Pad from "../Pad";
import Renderer from "../Renderer";
import { Vector } from "../Vector";
import { Drawable } from "../models";
import { ModeButton } from "./ModeButton";

/**
 * Erzeugt, behinhaltet und vorallem controlt den Button für den Editiermodus und den Editermodus.
 *  */
export class EditModeButton extends ModeButton implements Drawable {

    aktiveCreation: boolean = false;
    startCreation: Vector | undefined;
    endCreation: Vector | undefined;
    validColor: string;

    constructor(pad: Pad) {
        super(pad, "pen", false);
    }

    public set isActive(v: boolean) {
        this.setIsActive(v);
        this.resetCreation();
    }

    resetCreation() {
        this.aktiveCreation = false;
        this.startCreation = undefined;
        this.endCreation = undefined;
    }

    handleMouseDown(ev: MouseEvent): void {
        if (this.pad.input.isMouseLeftDown) {
            const selected = this.pad.gridDotView.selected();

            if (selected == null) return;
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
        this.resetCreation();
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
        if (this.startCreation == undefined || this.endCreation == undefined)
            return;
        renderer.drawLine(
            this.startCreation,
            this.endCreation,
            this.validColor
        );
    }
}
