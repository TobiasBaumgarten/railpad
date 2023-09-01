import { Vector } from "./Vector";

/**
 * Responsable for the view transformation between the grid and the canvas/screen
 */
export default class Camera {
    center: Vector;
    width: number;
    height: number;
    scale: number;
    zoomSpeed = 3;
    constructor(center: Vector = new Vector(0, 0)) {
        this.width = 0;
        this.height = 0;
        /** The center in grid Coordinates */
        this.center = center;
        this.scale = 32;
    }

    /**
     * Move the Camera in pixel
     * @param xDeltaPixel Movement in pixel on the x-Axis
     * @param yDeltaPixel Movement in pixel on the y-Axis
     */
    public move(xDeltaPixel: number, yDeltaPixel: number) {
        const move = new Vector(-xDeltaPixel, -yDeltaPixel).div(this.scale);
        this.center = this.center.add(move);
    }

    /**
     * Zoom the camera in (psotiv) or out (negativ)
     * @param dir The Direction of the zoom. Positiv zooms in and negativ out
     */
    public zoom(dir: number) {
        console.log(dir);
        
        const newScale = this.scale + (dir * this.zoomSpeed);
        if (newScale >= 8 && newScale < 124) {
            this.scale = newScale;
        }
    }

    /** Returns the current topLeft, topRight, buttonLeftm and ButtonRight from the camera */
    public get cornersScreenPosition(): Vector[] {
        const size = new Vector(this.width, this.height).div(2);
        const topLeft = this.center.sub(size);
        const topRight = new Vector(this.center.x + size.x, this.center.y - size.y);
        const buttonLeft = new Vector(this.center.x - size.x, this.center.y + size.y);
        const buttonRight = new Vector(this.center.x + size.x, this.center.y + size.y);
        return [topLeft, topRight, buttonLeft, buttonRight]
    }

    /** Returns the current camera position in Grid coordinates */
    public get cornersGridPosition(): Vector[] {
        const gridSize = new Vector(this.width, this.height).div(this.scale * 2).ceil();
        const gridCenter = this.center.floor();
        return [gridCenter.sub(gridSize), gridCenter.add(gridSize)]
    }

    /** The topLeft position of the camera in Screen coordninates */
    public get topLeft() {
        const size = new Vector(this.width, this.height).div(2);
        return this.center.sub(size);
    }

    /**
     * Transform a Grid psoition in a screen position.
     * @param gridVector A Grid position
     * @returns A Screen position
     */
    public getScreenPosition(gridVector: Vector): Vector {
        const fromCenter = gridVector.sub(this.center);
        const size = new Vector(this.width, this.height).div(2);
        const pos = fromCenter.multiply(this.scale).add(size)
        return pos;
    }

    /** Gets the screen position and returns the grid position unrounded */
    public getGridPosition(screenPosition: Vector): Vector {
        const size = new Vector(this.width, this.height).div(2);
        const offsetGridPoint = screenPosition.sub(size).div(this.scale);
        return this.center.add(offsetGridPoint);
    }

}