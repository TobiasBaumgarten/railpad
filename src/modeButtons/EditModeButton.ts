import Pad from "../Pad";
import Renderer from "../Renderer";
import { Vector } from "../Vector";
import { Drawable } from "../models";
import { ModeButton } from "./ModeButton";
//@ts-ignore
import editIcon from "bundle-text:../assets/icons/edit.svg";
//@ts-ignore
import deleteIcon from "bundle-text:../assets/icons/delete.svg";

/**
 * Erzeugt, behinhaltet und vorallem controlt den Button für den Editiermodus und den Editermodus.
 *  */
export class EditModeButton extends ModeButton implements Drawable {
    aktiveCreation: boolean = false;
    startCreation: Vector | undefined;
    endCreation: Vector | undefined;
    validColor: string;
    deleteButton: HTMLButtonElement;

    deleteMode: boolean = false;
    eraserImage: HTMLImageElement;
    editButton: HTMLButtonElement;

    constructor(pad: Pad) {
        super(pad, false);
        this.button.innerHTML = editIcon;

        // create delete button
        this.deleteButton = Object.assign(document.createElement("button"));
        this.deleteButton.innerHTML = deleteIcon;
        this.deleteButton.classList.add("icon", "delete");
        this.deleteButton.addEventListener("click", () => {
            if(this.deleteMode) return;            
            this.switchDeleteMode();
        });
        this.addControl(this.deleteButton);

        // create edit button
        this.editButton = Object.assign(document.createElement("button"));
        this.editButton.innerHTML = editIcon;
        this.editButton.classList.add("icon");
        this.editButton.addEventListener("click", () => {
            if(!this.deleteMode) return;
            this.switchDeleteMode();
        });
        this.addControl(this.editButton);



        this.eraserImage = new Image();
        this.eraserImage.src = new URL(
            "../assets/eraser.png",
            import.meta.url
        ).toString();
    }

    private switchDeleteMode() {
        console.log("switch delete mode");
        
        this.deleteMode = !this.deleteMode;
        if (!this.deleteButton) return;
        if (this.deleteMode) {
            this.pad.parent.classList.add("cursor-none");
            this.deleteButton.classList.add("active");
            this.editButton.classList.remove("active");
        } else {
            this.pad.parent.classList.remove("cursor-none");
            this.deleteButton.classList.remove("active");
            this.editButton.classList.add("active");
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
    handleClick(ev: MouseEvent): void { }

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

    handleWheel(ev: WheelEvent): void { }

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
