import { ModeButton } from "./ModeButton";
import { download } from "../helper";

export class SaveModeButton extends ModeButton {

    constructor(pad) {
        super(pad,"save")
        this.button.addEventListener("click", (ev) => {
            const content = JSON.stringify(this.pad.nodeController.serialize());
            download(content, "gleisplan.json", "json")
            this.setIsActive(false)
        })
    }

    setIsActive(v: boolean) {}
    handleMouseDown(ev: MouseEvent): void {}
    handleMouseUp(ev: MouseEvent): void {}
    handleClick(ev: MouseEvent): void {}
    handleMove(ev: MouseEvent): void {}
    handleWheel(ev: WheelEvent): void {}
}
