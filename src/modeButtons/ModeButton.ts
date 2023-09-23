import Pad from "../Pad";

/**
 * The Base Button hand Handler housing vor the main modies.
 */
export abstract class ModeButton {
    button: HTMLButtonElement;
    protected _isActive: boolean;
    pad: Pad;
    controlDiv: HTMLDivElement;

    constructor(pad: Pad, isActive = false) {
        this.pad = pad;
        this.createAButton();
        this.isActive = isActive;
        this.wireHandlers();

        this.controlDiv = Object.assign(document.createElement("div"), {
            classList: ["controlDiv hidden btn-group vertical"],
        });
        this.pad.parent.appendChild(this.controlDiv)
        this.resetVisibility();
    }

    public get isActive(): boolean {
        return this._isActive;
    }
    public set isActive(v: boolean) {
        this._isActive = v;
        this.setClassName();
        this.resetVisibility();
        this.setIsActive(v);
    }

    public addControl(control: HTMLElement | any) { 
        this.controlDiv.appendChild(control); 
    }


    abstract setIsActive(v: boolean);

    protected resetVisibility() {
        if (this.controlDiv == undefined) return;
        if (this._isActive) {
            this.controlDiv.classList.remove("hidden");
        }
        else {
            this.controlDiv.classList.add("hidden");
        }
    }



    public setClassName() {
        if (!this.button) return;
        const cNs: string[] = [];
        cNs.push(`icon`);
        cNs.push(this._isActive ? "active" : "");
        this.button.className = cNs.join(" ");
    }

    public get className(): string {
        return this.button?.className;
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
