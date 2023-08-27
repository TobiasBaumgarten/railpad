import Camera from "./Camera";

import { PadStyle } from "./models/PadStyle";
import { Vector } from "./Vector";

export default class Renderer {
    ctx: CanvasRenderingContext2D;
    camera: Camera;
    padStyle: PadStyle;

    constructor(
        ctx: CanvasRenderingContext2D,
        camera: Camera,
        padStyle: PadStyle
    ) {
        this.ctx = ctx;
        this.camera = camera;
        this.padStyle = padStyle;
    }

    public clear(color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    public isVectorOnScreen(vectorScreen: Vector) {
        // const vecScreen = this.camera.getScreenPosition(vector);
        return (
            vectorScreen.x >= 0 &&
            vectorScreen.y >= 0 &&
            vectorScreen.x < this.ctx.canvas.width &&
            vectorScreen.y < this.ctx.canvas.height
        );
    }

    public drawDot(radius: number, position: Vector, strokeStyle: string) {
        const p = this.camera.getScreenPosition(position);
        this.drawScreenDot(radius * this.camera.scale, p, strokeStyle);
    }

    public drawLine(
        start: Vector,
        end: Vector,
        style: string = "#000000",
        lineWidth = 2
    ) {
        const s = this.camera.getScreenPosition(start);
        const e = this.camera.getScreenPosition(end);
        this.drawScreenLine(s, e, style, lineWidth);
    }

    public drawTriangle(
        start: Vector,
        mid: Vector,
        end: Vector,
        style: string = "#000000"
    ) {
        const points = [
            this.camera.getScreenPosition(start),
            this.camera.getScreenPosition(mid),
            this.camera.getScreenPosition(end),
        ];
        const everyNotOnScreen = points.every((p) => !this.isVectorOnScreen(p));
        if (everyNotOnScreen) return;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        this.ctx.lineTo(points[1].x, points[1].y);
        this.ctx.lineTo(points[2].x, points[2].y);
        this.ctx.closePath();
        this.ctx.fillStyle = style;
        this.ctx.fill();
    }

    public drawScreenLine(
        start: Vector,
        end: Vector,
        strokeStyle: string,
        lineWitdth = 2
    ) {
        if (!this.isVectorOnScreen(start) && !this.isVectorOnScreen(end))
            return;
        this.ctx.beginPath();
        this.ctx.lineWidth = lineWitdth;
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.closePath();
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.stroke();
    }

    public drawScreenDot(
        radius: number,
        position: Vector,
        strokeStyle: string
    ) {
        if (!this.isVectorOnScreen(position)) return;
        const endAngle = Math.PI * 2;
        this.ctx.beginPath();
        this.ctx.arc(position.x, position.y, radius, 0, endAngle);
        this.ctx.closePath();
        this.ctx.fillStyle = strokeStyle;
        this.ctx.fill();
    }

    public drawScreenImage(image, dx, dy, dWidth, dHeight) {
        this.ctx.drawImage(image, dx, dy,dWidth, dHeight);
    }
}
