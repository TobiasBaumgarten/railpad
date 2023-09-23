import Renderer from "../Renderer";
import { Drawable } from "../models";
import { ModeButton } from "./ModeButton";
//@ts-ignore
import eye from "bundle-text:../assets/icons/eye.svg";
//@ts-ignore
import eyeOff from "bundle-text:../assets/icons/eye_off.svg";
/**
 * Contains, create the ViewMode Button and especially handels the view mode 
 */
export class ViewModeButton extends ModeButton {
    constructor(pad, active: boolean) {
        super(pad, active);
        this.button.innerHTML = eye;
    }


    setIsActive(v: boolean) {
        this.pad.gridDotView.viewDots = !v;
        this.pad.gridDotView.viewHover = !v;
        this.button.innerHTML = v ? eyeOff : eye;
    }

    handleMouseDown(ev: MouseEvent): void {}
    handleMouseUp(ev: MouseEvent): void {}
    handleClick(ev: MouseEvent): void {}
    handleMove(ev: MouseEvent): void {}
    handleWheel(ev: WheelEvent): void {}
}
