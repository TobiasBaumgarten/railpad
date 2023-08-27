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
        return this.nodes.has(node.hash());
    }

    get(node: Vector): Node | undefined {
        if (!this.isIn(node))
            throw new Error(`${node.hash()} not in the controller`);
        return this.nodes.get(node.hash());
    }

    add(node: Vector, ...neighbors: Vector[]) {
        let addNode = new Node(node.x, node.y);
        if (this.isIn(node)) {
            addNode = this.get(node)!;
        } else {
            this.nodes.set(addNode.hash(), addNode);
        }
        addNode.addNeighbors(...neighbors);
    }

    remove(node: Node | Vector): boolean {
        // TODO: Da ist irgendwo noch ein bug den ich fixen muss
        // Manchaml werden die nachbarn nicht richtig gelöscht
        const n = this.nodes.get(node.hash());
        let removales: Node[] = [];
        n?.neighbors.forEach((neigVec) => {
            const neig = this.nodes.get(neigVec.hash());
            neig?.removeNeighbor(n);
            if (neig != undefined && neig.neighbors.length == 0)
                removales.push(neig);
        });
        removales.forEach((r) => this.remove(r));
        return this.nodes.delete(node.hash());
    }

    deserialize(models: NodeModel[]) {
        this.nodes.clear();
        models.forEach((m) => {
            let node = Node.deserialize(m);
            this.nodes.set(node.hash(), node);
        });
    }

    serialize(): NodeModel[] {
        let result: NodeModel[] = []
        this.nodes.forEach(n => {
            result.push(n.serialize())
        })
        return result;
    }

    private collectNodes(start: Vector, end: Vector): Vector[] | null {
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
        const valid = this.isValidNeighbors(start, end);
        if (!valid) return;
        for (let i = 0; i < collection!.length; i++) {
            let newNeighbors: Vector[] = [];
            if (i > 0) {
                newNeighbors.push(collection![i - 1]);
            }
            if (i < collection!.length - 1) {
                newNeighbors.push(collection![i + 1]);
            }
            this.add(collection![i], ...newNeighbors);
        }
    }

    isValidNeighbors(start: Vector, end: Vector): boolean {
        const newCollection = this.collectNodes(start, end);
        if (newCollection === null) return false;
        for (let i = 0; i < newCollection.length; i++) {
            const n = new Node(newCollection[i].x, newCollection[i].y);
            if (n === undefined) continue;
            if (i > 0) {
                if (!n.isValidNeighbor(newCollection[i - 1])) return false;
            }
            if (i < newCollection.length - 1) {
                if (!n.isValidNeighbor(newCollection[i + 1])) return false;
            }
        }
        return true;
    }

    draw(renderer: Renderer): void {
        this.nodes.forEach((n) => n.draw(renderer));
    }
}
