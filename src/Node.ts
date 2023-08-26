import Renderer from "./Renderer";
import { Vector } from "./Vector";
import { NodeModel, Drawable } from "./models";

const THICKNESS = 15;

export default class Node extends Vector implements Drawable {
    x: number;
    y: number;
    neighbors: Vector[];
    lineColor?: string;
    backColor?: string;
    description?: number;
    switchLength: number = 2.5;

    constructor(x: number, y: number) {
        super(x, y);
        this.neighbors = [];
        this.lineColor = "#000000";
    }

    addNeighbors(...neighbor: Vector[]) {
        neighbor.forEach((n) => {
            if (!this.isValidNeighbor(n)) {
                throw new Error(
                    `The Neighbor (x:${n.x} , y ${n.y}) isn't valid`
                );
            }

            this.neighbors.push(n);
        });
    }

    removeNeighbor(neighbor: Vector) {
        const index = this.neighbors.indexOf(neighbor);
        this.neighbors.splice(index - 1, 1);
    }

    isValidNeighbor(neighbor: Vector) {
        const norm = this.sub(neighbor);
        const norms = this.neighbors.map((n) => this.sub(n));
        const abs = norm.call(Math.abs);
        // the neighbor have to be a neighbor node
        if (abs.x > 1 || abs.y > 1) return false;
        if (abs.x == 1 || abs.y == 1) return true;

        // it isn't allowed, that to neighbors are in angel of 90 degree
        // const rotate1 = norm.rotate(Math.PI/2).round(); // Rotate 90 degree
        // if(norms.some( n => n.eq(rotate1))) return false;
        // if(norms.some( n => n.eq(rotate1.multiply(-1)))) return false; // invert

        return false;
    }

    isSwitch(): boolean {
        return this.neighbors.length > 2;
    }

    getSwitchNeighbors(): { a: Vector; b: Vector }[] {
        const norms = this.neighbors.map((n) => this.sub(n));
        const base = new Vector(1, 0);
        const result: any = [];
        for (let times = 0; times <= 7; times++) {
            const rot1 = base.rotate((Math.PI / 4) * times).round();
            const rot2 = base.rotate((Math.PI / 4) * (times + 1)).round();
            if (
                norms.some((n) => n.eq(rot1)) &&
                norms.some((n) => n.eq(rot2))
            ) {
                result.push({ a: rot1, b: rot2 });
            }
        }
        return result;
    }

    serialize(): NodeModel {
        let neighborsSerialized: number[] = [];
        this.neighbors.forEach((n) => neighborsSerialized.push(n.x, n.y));
        return {
            p: [this.x, this.y],
            n: neighborsSerialized,
            l: this.lineColor,
            b: this.backColor,
        };
    }

    static deserialize(nodeModel: NodeModel): Node {
        let deNaighbors: Vector[] = [];
        for (let i = 0; i < nodeModel.n.length; i += 2) {
            let v = new Vector(nodeModel.n[i], nodeModel.n[i + 1]);
            deNaighbors.push(v);
        }
        const node = new Node(nodeModel.p[0], nodeModel.p[1]);
        node.neighbors = deNaighbors;

        node.lineColor = nodeModel.l;
        node.backColor = nodeModel.b;
        return node;
    }

    private calcHalfPosition(node: Vector) {
        return this.add(node).div(2);
    }

    draw(renderer: Renderer): void {
        if (this.backColor) {
            this.neighbors.forEach((node) => {
                renderer.drawLine(
                    this,
                    this.calcHalfPosition(node),
                    this.backColor,
                    THICKNESS
                );
            });
        }

        this.neighbors.forEach((node) => {
            renderer.drawLine(
                this,
                this.calcHalfPosition(node),
                this.lineColor
            );
        });

        if (this.isSwitch()) {
            this.getSwitchNeighbors().forEach((s) => {
                const d = -1 / this.switchLength;
                renderer.drawTriangle(
                    this,
                    this.add(s.a.multiply(d)),
                    this.add(s.b.multiply(d)),
                    this.lineColor
                );
            });
        }
    }
}
