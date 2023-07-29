import { Vector } from "../Model/Vector";

export default class CameraView {
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

    public move(xDeltaPixel: number, yDeltaPixel: number) {
        const move = new Vector(-xDeltaPixel, -yDeltaPixel).div(this.scale);
        this.center = this.center.add(move);
    }

    public zoom(dir: number) {
        const newScale = this.scale + (dir * this.zoomSpeed);
        if (newScale >= 8 && newScale < 124) {
            this.scale = newScale;
        }
    }

    public get cornersScreenPosition(): Vector[] {
        const size = new Vector(this.width, this.height).div(2);
        const topLeft = this.center.sub(size);
        const topRight = new Vector(this.center.x + size.x, this.center.y - size.y);
        const buttonLeft = new Vector(this.center.x - size.x, this.center.y + size.y);
        const buttonRight = new Vector(this.center.x + size.x, this.center.y + size.y);
        return [topLeft, topRight, buttonLeft, buttonRight]
    }

    public get cornersGridPosition(): Vector[] {
        const gridSize = new Vector(this.width, this.height).div(this.scale * 2).ceil();
        const gridCenter = this.center.floor();
        return [gridCenter.sub(gridSize), gridCenter.add(gridSize)]
    }

    public get topLeft() {
        const size = new Vector(this.width, this.height).div(2);
        return this.center.sub(size);
    }

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