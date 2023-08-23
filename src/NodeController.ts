import { Vector } from "./Vector";
import Node from "./Node";
import Renderer from "./Renderer";
import { NodeModel } from "./models";

export default class NodeController {
    nodes: Map<string, Node>;

    constructor() {
        this.nodes = new Map<string, Node>();
    }

    isIn(node: Vector) {
        return node.hash() in this.nodes;
    }

    get(node: Vector): Node | undefined {
        if (!this.isIn(node))
            throw new Error(`${node.hash()} not in the controller`);
        return this.nodes.get(node.hash());
    }

    add(node: Vector, ...neighbors: Vector[]) {
        let addNode = new Node(node.x, node.y);
        if (this.isIn(node)) {
            throw new Error(
                `Node ${addNode.hash()} is already in your collection`
            );
        }
        this.nodes.set(addNode.hash(), addNode);
        addNode.addNeighbors(...neighbors);
    }

    remove(node: Node | Vector): boolean {
        return this.nodes.delete(node.hash());
    }

    deserialize(models: NodeModel[]) {
        this.nodes.clear();
        models.forEach((m) => {
            let node = Node.deserialize(m);
            this.nodes.set(node.hash(), node);
        });
    }

    private collectNodes(start: Vector, end: Vector): Vector[] | null {
        // const Vstart = Vector.fromPosition(start);
        // const Vend = Vector.fromPosition(end);
        const base = start.sub(end);
        // There have to be a check if the base is diagonal or horizontal!!!!
        if (!(base.isHorizontal || base.isDiagonal)) return null;
        if (!base.isInteger) return null;

        const normal = base.normal.round();
        let result: Vector[] = [];

        for (let i = new Vector(0, 0); !i.eq(base); i = i.add(normal)) {
            let Vresult = i.clone().add(end);
            result.push(Vresult);
        }
        result.push(start);
        return result;
    }

    createLine(start: Vector, end: Vector) {
        const collection = this.collectNodes(start, end);
        const valid = this.isValidNeighbors(collection);
        if (!valid) return;
        for (let i = 0; i < collection!.length; i++) {
            if (i > 0) {
                this.add(collection![i], collection![i - 1]);
            }
            if (i < collection!.length - 1) {
                this.add(collection![i], collection![i + 1]);
            }
        }
    }

    isValidNeighbors(newCollection: Vector[] | null): boolean {
        if (newCollection === null) return false;
        for (let i = 0; i < newCollection.length; i++) {
            const n = this.get(newCollection[i]);
            if (n === undefined) continue;
            console.log(n, newCollection);
            if (i > 0) {
                if (!n.isValidNeighbor(newCollection[i - 1]))
                    return false;
            }
            if (i < newCollection.length - 1) {
                if (!n.isValidNeighbor(newCollection[i + 1]))
                    return false;
            }
        }
        return true;
    }

    draw(renderer: Renderer): void {
        this.nodes.forEach((n) => n.draw(renderer));

        // if (!this.activeCreation) return;

        // debounce(this.setValidColor(), 500);
        // renderer.drawLine(this.startCreate, this.endCreate, this.validColor);
    }
}
