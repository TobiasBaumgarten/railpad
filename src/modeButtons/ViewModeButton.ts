import Renderer from "../Renderer";
import { Drawable } from "../models";
import { ModeButton } from "./ModeButton";

/**
 * Contains, create the ViewMode Button and especially handels the view mode 
 */
export class ViewModeButton extends ModeButton {
    constructor(pad, active: boolean) {
        super(pad, "eye", active);
    }

    public set isActive(v: boolean) {
        this.setIsActive(v);
        this.pad.gridDotView.viewDots = !v;
        this.pad.gridDotView.viewHover = !v;
    }

    handleMouseDown(ev: MouseEvent): void {}
    handleMouseUp(ev: MouseEvent): void {}
    handleClick(ev: MouseEvent): void {}
    handleMove(ev: MouseEvent): void {}
    handleWheel(ev: WheelEvent): void {}
}
