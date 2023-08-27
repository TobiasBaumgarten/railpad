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

    public drawRect(
        pos: Vector,
        width: number,
        height: number,
        fillStyle: string
    ) {
        const sp = this.camera.getScreenPosition(pos);
        this.drawScreenRect(
            sp.x,
            sp.y,
            width * this.camera.scale,
            height * this.camera.scale,
            fillStyle
        );
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
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        this.ctx.lineTo(points[1].x, points[1].y);
        this.ctx.lineTo(points[2].x, points[2].y);
        this.ctx.closePath();
        this.ctx.fillStyle = style;
        this.ctx.fill();
        this.ctx.restore();
    }

    public drawText(
        text: string,
        pos: Vector,
        rotation: number = 0,
        size: number = 11,
        font: string = "serif",
        backgroundColor?: boolean
    ) {
        let gridV = this.camera.getScreenPosition(pos);

        this.drawScreenText(
            text,
            gridV.x,
            gridV.y,
            rotation,
            size,
            font,
            backgroundColor
        );
    }

    public drawScreenLine(
        start: Vector,
        end: Vector,
        strokeStyle: string,
        lineWitdth = 2
    ) {
        if (!this.isVectorOnScreen(start) && !this.isVectorOnScreen(end))
            return;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = lineWitdth;
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.closePath();
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.stroke();
        this.ctx.restore();
    }

    public drawScreenDot(radius: number, position: Vector, fillStyle: string) {
        if (!this.isVectorOnScreen(position)) return;
        const endAngle = Math.PI * 2;
        this.ctx.beginPath();
        this.ctx.arc(position.x, position.y, radius, 0, endAngle);
        this.ctx.closePath();
        this.ctx.fillStyle = fillStyle;
        this.ctx.fill();
    }

    public drawScreenImage(image, dx, dy, dWidth, dHeight) {
        this.ctx.drawImage(image, dx, dy, dWidth, dHeight);
    }

    public drawScreenText(
        text: string,
        x: number,
        y: number,
        rotation: number = 0,
        size: number,
        font: string,
        backgroundColor?: boolean
    ) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.textAlign = "center";
        this.ctx.font = `${size}px ${font}`;
        this.ctx.rotate(rotation);
        if (backgroundColor) {
            const dim = this.ctx.measureText(text);
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(0, 0, dim.width, size);
            this.ctx.stroke();
        }
        this.ctx.fillStyle = this.padStyle.nodeLineDefault;
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    }

    public drawScreenRect(
        x: number,
        y: number,
        width: number,
        height: number,
        fillstyle: string
    ) {      
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = fillstyle;
        this.ctx.rect(x, y, width, height);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }
}
