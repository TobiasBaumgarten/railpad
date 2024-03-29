import Renderer from "./Renderer";
import { Vector } from "./Vector";
import { NodeModel, Drawable } from "./models";

const THICKNESS = 15;

/**
 * A Node is a point in the grid
 */
export default class Node extends Vector implements Drawable {
    /** The x position in the grid */
    x: number;
    /** The y position in the grid */
    y: number;
    /** The neighbors of the node */
    neighbors: Vector[];
    /** The color of the line */
    lineColor?: string;
    /** The color of the background */
    backColor?: string;
    /** The description of the node */
    description?: number;
    /** The length of the switch */
    switchLength: number = 2.5;

    constructor(x: number, y: number) {
        super(x, y);
        this.neighbors = [];
        this.lineColor = "#000000";
    }

    /** Adds neighbors to the node with the grid coordinates*/
    addNeighbors(...neighbors: Vector[]) {
        neighbors.forEach((n) => {
            if (!this.isValidNeighbor(n)) {
                throw new Error(
                    `The Neighbor (x:${n.x} , y ${n.y}) isn't valid`
                );
            }

            this.neighbors.push(n.sub(this));
        });
    }

    /** Adds neighbors to the node with the relativ coordinates. example: [-1,0] */
    addNeigborsNormal(...neighbors: Vector[]) {
        neighbors.forEach((n) => {
            if (!this.isValidNeighbor(n, true)) {
                throw new Error(
                    `The Neighbor (x:${n.x} , y ${n.y}) isn't valid`
                );
            }
            this.neighbors.push(n);
        });
    }

    /** Removes a neighbor from the node */
    removeNeighbor(neighbor: Vector, norm = false) {
        const neig = norm ? neighbor : neighbor.sub(this);
        let index = -1;
        for (let i = 0; i < this.neighbors.length; i++) {
            if (this.neighbors[i].eq(neig)) {
                index = i;
                break;
            }
        }
        this.neighbors.splice(index, 1);
    }

    /** Checks if the neighbor is valid */
    isValidNeighbor(neighbor: Vector, normValue = false) {
        let norm: Vector;
        if (!normValue) norm = this.sub(neighbor);
        else norm = neighbor;

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

    /** Checks if the node is a switch */
    isSwitch(): boolean {
        return this.neighbors.length > 2;
    }

    /** Returns the switch neighbors */
    getSwitchNeighbors(): { a: Vector; b: Vector }[] {
        // const norms = this.neighbors.map((n) => this.sub(n));
        const base = new Vector(1, 0);
        const result: any = [];
        // Go through every 45° possibility and ...
        for (let times = 0; times <= 7; times++) {
            const rot1 = base.rotate((Math.PI / 4) * times).round();
            const rot2 = base.rotate((Math.PI / 4) * (times + 1)).round();
            if (
                // check if both are there
                this.neighbors.some((n) => n.eq(rot1)) &&
                this.neighbors.some((n) => n.eq(rot2))
            ) {
                // when its there, push it in the result array
                result.push({ a: rot1, b: rot2 });
            }
        }
        return result;
    }

    /**
     * Serializes the node to a NodeModel
     * @returns the node as a NodeModel
     */
    serialize(): NodeModel {
        let neighborsSerialized: number[] = [];
        this.neighbors.forEach((n) => neighborsSerialized.push(n.x, n.y));
        return {
            p: [this.x, this.y],
            n: neighborsSerialized,
            lc: this.lineColor,
            bc: this.backColor,
            d: this.description,
        };
    }

    /** 
     * Deserializes a NodeModel to a Node
     * @param nodeModel the NodeModel
    */
    static deserialize(nodeModel: NodeModel): Node {
        let deNaighbors: Vector[] = [];
        for (let i = 0; i < nodeModel.n.length; i += 2) {
            let v = new Vector(nodeModel.n[i], nodeModel.n[i + 1]);
            deNaighbors.push(v);
        }
        const node = new Node(nodeModel.p[0], nodeModel.p[1]);
        node.neighbors = deNaighbors;

        node.lineColor = nodeModel.lc;
        node.backColor = nodeModel.bc;
        node.description = nodeModel.d;
        return node;
    }

    /** Finds a free space for the text */
    private findFreeSpace4Text(): [Vector, number] {
        let position = new Vector(0, -1);
        const rotation = Math.PI / 4;
        for (let i = 0; i < 8; i++) {
            const a = position.rotate(-rotation).round();
            const b = position.rotate(rotation).round();
            if (this.neighbors.some((n) => n.eq(a) || n.eq(b))) {
                position = position.rotate(rotation).round();
                continue;
            } else return [position, rotation * i];
        }
        return [position, rotation];
    }

    /** Draws the node */
    draw(renderer: Renderer): void {
        this.neighbors.forEach((neighbor) => {
            if (this.backColor) {
                renderer.drawLine(
                    this,
                    this.add(neighbor.div(2)),
                    this.backColor,
                    THICKNESS
                );
            }
            renderer.drawLine(this, this.add(neighbor.div(2)), this.lineColor);
        });

        if (this.isSwitch()) {
            this.getSwitchNeighbors().forEach((swNeig) => {
                const d = 1 / this.switchLength;
                renderer.drawTriangle(
                    this,
                    this.add(swNeig.a.multiply(d)),
                    this.add(swNeig.b.multiply(d)),
                    this.lineColor
                );
            });
        }

        if (this.description) {
            let text = "";
            let [pos, rot] = this.findFreeSpace4Text();
            let textRot = 0;
            // let backcolor: boolean = false
            if (this.isSwitch()) {
                text += "W";
                textRot = rot;

                // pos.y = pos.y > 0 ? 4 : pos.y;
                if (rot >= Math.PI) {
                    textRot = rot - Math.PI;
                    pos = pos.multiply(new Vector(1, 1.7));
                }
            } else {
                renderer.drawRect(
                    this.add(new Vector(-0.25, -0.25)),
                    0.5,
                    0.4,
                    "rgba(255,255,255,.9)"
                    //TODO: DO NOT HARDCODED!
                );
                pos = new Vector(0, 0.5);
            }

            text += this.description.toString();
            renderer.drawText(text, this.add(pos.multiply(0.2)), textRot);
        }
    }
}
