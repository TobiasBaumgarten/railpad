import Pad from "../Pad";

/**
 * The Base Button hand Handler housing vor the main modies.
 */
export abstract class ModeButton {
    button: HTMLButtonElement;
    iconName: string;
    protected _isActive: boolean;
    pad: Pad;

    constructor(pad: Pad, iconName: string, isActive = false) {
        this.pad = pad;
        this.iconName = iconName;
        this.createAButton();
        this.isActive = isActive;
        this.wireHandlers();
    }
    public set isActive(v: boolean) {
        this.setIsActive(v);
    }

    protected setIsActive(v: boolean) {
        this._isActive = v;
        this.setClassName();
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    public setClassName() {
       
        if (!this.button) return;
        const cNs: string[] = [];
        cNs.push(`fa-solid fa-${this.iconName}`);
        cNs.push(this._isActive ? "active" : "");
        this.button.className = cNs.join(" ");
    }

    public get className(): string {
        return this.button?.className;
    }

    public test() {
        console.log("HEY");
    }

    private createAButton() {
        this.button = document.createElement("button");
        this.setClassName();
    }

    private wireHandlers() {
        this.pad.input.onMove.add((gp) => 
            this.callWhenActive(() => this.handleMove(gp))
        );
        this.pad.input.onWheel.add((_, ev) =>
            this.callWhenActive(() => this.handleWheel(ev))
        );
        this.pad.input.onClick.add((ev) =>
            this.callWhenActive(() => this.handleClick(ev))
        );
        this.pad.input.onMouseDown.add((ev) =>
            this.callWhenActive(() => this.handleMouseDown(ev))
        );
        this.pad.input.onMouseUp.add((ev) =>
            this.callWhenActive(() => this.handleMouseUp(ev))
        );
    }

    private callWhenActive(func: any) {
        if (this._isActive) func();
    }

    abstract handleMouseDown(ev: MouseEvent): void;
    abstract handleMouseUp(ev: MouseEvent): void;
    abstract handleClick(ev: MouseEvent): void;
    abstract handleMove(ev: MouseEvent): void;
    abstract handleWheel(ev: WheelEvent): void;
}
