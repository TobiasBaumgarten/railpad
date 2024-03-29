import { Drawable } from "./models";
import Renderer from "./Renderer";
import { Vector } from "./Vector";

/**
 * Responsable for the for the drawing of the dots and the interaction to the user.
 */
export class GridDotView implements Drawable {
    mouseGridPosition: Vector;
    hoverRadius = 0.1;
    intersectRadius = 0.4;
    dotRadius = 0.05;
    viewDots = true;
    viewHover = true;
    constructor() {}

    /** If the mouse is over an dot (in the intersectRadius) returns true */
    public get isMouseOverDot(): boolean {
        return this.getHover() !== null;
    }

    /**
     * If an mouse is over on dot in the range of the intersectRadius, it reutrns a Vector, else it returns null
     * @returns Vector in grid coordinates or null
     */
    private getHover(): Vector | null {
        if (this.mouseGridPosition === undefined) return null;
        const xAbs = Math.abs(this.mouseGridPosition.x % 1);
        const yAbs = Math.abs(this.mouseGridPosition.y % 1);
        if (
            (xAbs < this.intersectRadius || xAbs > 1 - this.intersectRadius) &&
            (yAbs < this.intersectRadius || yAbs > 1 - this.intersectRadius)
        ) {
            return this.mouseGridPosition.round();
        }
        return null;
    }

    /** Returns a grid dot if the mouse is hovers over a dot, else it returns null */
    public selected(): Vector | null {
        return this.getHover();
    }

    /**
     * Responsible to draw the dots on the grid.
     * @param renderer The Renderer
     * @returns void
     */
    draw(renderer: Renderer): void {
        const cam = renderer.camera;
        const corners = cam.cornersGridPosition;
        const start = cam.getScreenPosition(corners[0]);
        const end = cam.getScreenPosition(corners[1]);
        const radius = cam.scale * this.dotRadius;

        const hover = this.getHover();
        if (hover != null && this.viewHover) {
            renderer.drawDot(
                this.hoverRadius,
                hover,
                renderer.padStyle.dotHoverColor
            );
        }

        if (!this.viewDots) return;
        for (let y = start.y; y < end.y; y += cam.scale) {
            for (let x = start.x; x < end.x; x += cam.scale) {
                if (x < 0 || y < 0) continue;
                renderer.drawScreenDot(
                    radius,
                    new Vector(x, y),
                    renderer.padStyle.dotColor
                );
            }
        }
    }
}
