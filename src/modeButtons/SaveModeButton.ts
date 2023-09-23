import { ModeButton } from "./ModeButton";
import { download } from "../helper";
//@ts-ignore
import disk from "bundle-text:../assets/icons/save.svg";

export class SaveModeButton extends ModeButton {
    constructor(pad) {
        super(pad);
        this.button.innerHTML = disk;
        this.button.addEventListener("click", (ev) => {
            const content = JSON.stringify(this.pad.nodeController.serialize());
            download(content, "gleisplan.json", "json");
            this.setIsActive(false);
        });
    }

    setIsActive(v: boolean) {}
    handleMouseDown(ev: MouseEvent): void {}
    handleMouseUp(ev: MouseEvent): void {}
    handleClick(ev: MouseEvent): void {}
    handleMove(ev: MouseEvent): void {}
    handleWheel(ev: WheelEvent): void {}
}
