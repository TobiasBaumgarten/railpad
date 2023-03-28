import { Drawable, NodeStateModel, NodeState, PadStyle, VectorModel } from "../models";
import Renderer from "../Renderer";
import { Vector } from "../Vector";

type VectorPair = { a: Vector; b: Vector };

export default class Node implements NodeStateModel, Drawable {
    position: Vector;
    neighbors: Vector[];
    state: NodeState;
    switches: VectorPair[];
    switchLength = 2.5;

    constructor(
        position: Vector,
        neighbors: Vector[] = [],
        state: NodeState = NodeState.default
    ) {
        this.position = position;
        this.neighbors = neighbors;
        this.state = state;
        this.switches = [];
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
        this.switches = this.getSwitchNeighbors();
    }

    removeNeighbor(neighbor: Vector) {
        const i = this.neighbors.indexOf(neighbor);
        if (i == -1) return; // if the index is -1 it ins't in the list
        this.neighbors.splice(i, 1);
        this.switches = this.getSwitchNeighbors();
    }

    isValidNeighbor(neighbor: Vector) {
        const norm = this.position.sub(neighbor);
        const norms = this.neighbors.map((n) => this.position.sub(n));
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

    getSwitchNeighbors(): VectorPair[] {
        const norms = this.neighbors.map((n) => this.position.sub(n));
        const base = new Vector(1, 0);
        const result: VectorPair[] = [];
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

    getStyle(style: PadStyle): string {
        switch (this.state) {
            case NodeState.build:
                return style.nodeLineBuild;
            case NodeState.builded:
                return style.nodeLineBuilded;
            case NodeState.deconstruct:
                return style.nodeLineDeconstruct;
            case NodeState.ghost:
                return style.nodeLineGhost;
            default:
                return style.nodeLineDefault;
        }
    }

    private calcHalfPosition(node: Vector) {
        return this.position.add(node).div(2);
    }

    draw(renderer: Renderer): void {
        this.neighbors.forEach((node) => {
            renderer.drawLine(
                this.position,
                this.calcHalfPosition(node),
                this.getStyle(renderer.padStyle)
            );
        });

        this.switches.forEach((s) => {
            const d = -1 / this.switchLength;
            renderer.drawTriangle(
                this.position,
                this.position.add(s.a.multiply(d)),
                this.position.add(s.b.multiply(d)),
                this.getStyle(renderer.padStyle)
            );
        });
    }
}
