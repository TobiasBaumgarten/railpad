import Camera from "../Camera";
import { Drawable, PadStyle, Vector } from "../models";
import Renderer from "../Renderer";

export default class GridDots implements Drawable {
    mouseGridPosition: Vector
    hoverRadius = 0.1;
    dotRadius = 0.05;
    constructor() {
    }

    public get isMouseOverDot(): boolean {
        return this.getHover(this.hoverRadius*2) !== null;
    }

    private getHover(intersectRadius): Vector | null {
        if(this.mouseGridPosition === undefined)
            return null;
        const xAbs = Math.abs(this.mouseGridPosition.x % 1);
        const yAbs = Math.abs(this.mouseGridPosition.y % 1);
        if ((xAbs < intersectRadius || xAbs > (1 - intersectRadius)) &&
            (yAbs < intersectRadius || yAbs > (1 - intersectRadius))) {
            return this.mouseGridPosition.round();
        }
        return null;
    }


    /** Returns a grid dot if the mouse is hovers over a dot, else it returns null */
    public selected(): Vector | null {
        return this.getHover(this.hoverRadius*2);
    }

    draw(renderer: Renderer): void {
        const cam = renderer.camera;
        const corners = cam.cornersGridPosition;
        const start = cam.getScreenPosition(corners[0]);
        const end = cam.getScreenPosition(corners[1]);
        const radius = cam.scale * this.dotRadius;

        const hover = this.getHover(this.hoverRadius*2);
        if (hover != null) {
            renderer.drawDot(this.hoverRadius, hover, renderer.padStyle.dotHoverColor)
        }

        for (let y = start.y; y < end.y; y += cam.scale) {
            for (let x = start.x; x < end.x; x += cam.scale) {
                if (x < 0 || y < 0)
                    continue;
                renderer.drawScreenDot(radius, new Vector(x, y), renderer.padStyle.dotColor)
            }
        }

    }
}