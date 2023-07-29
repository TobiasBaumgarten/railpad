import { Vector } from "../Pad/Vector";
import { Position, Node } from "../Pad/models";

export default class NodeModel {
    public nodes: Node[];

    constructor() {
        this.nodes = [];
    }

    getNode(pos: Position) {
        return this.nodes.find(
            (n) => n.position.x == pos.x && n.position.y == pos.y
        );
    }

    hasNodePosition(pos: Position) {
        return this.getNode(pos) != undefined;
    }

    addNodeAndNeighbors(position: Position, ...neighbors: Position[]) {
        // when a node is already there get it, or create a new one
        let node = this.getNode(position);
        if (node == undefined) {
            node = { position: position, neighbors: [], state: undefined };
        }

        // check if all neigbors a valid
        neighbors.forEach((neighbor) => {
            if (!this.isValidNeighbor(node!, neighbor)) {
                throw new Error(
                    `The Neighbor (x:${neighbor.x} , y ${neighbor.y}) isn't valid`
                );
            }
            if (neighbors == undefined) node!.neighbors = [];
            node!.neighbors!.push(neighbor);
        });
        this.nodes.push(node);
    }

    isValidNeighbor(node: Node, neighbor: Position) {
        // if there isn't any neighbor, the new neigbor is always valid
        if (node.neighbors == undefined) return true;
        // transform the positions in vector for easy calculation
        const nodeVector = Vector.fromPosition(node.position);
        const neighborVector = Vector.fromPosition(neighbor);

        const norm = nodeVector.sub(neighborVector);

        const abs = norm.call(Math.abs);
        // the neighbor has to be a neighbor node
        if (abs.x > 1 || abs.y > 1) return false;
        if (abs.x == 1 || abs.y == 1) return true;

        // it isn't allowed, that to neighbors are in angel of 90 degree
        // const norms = node.neighbors.map((n) =>
        //     nodeVector.sub(Vector.fromPosition(n))
        // );
        // const rotate1 = norm.rotate(Math.PI/2).round(); // Rotate 90 degree
        // if(norms.some( n => n.eq(rotate1))) return false;
        // if(norms.some( n => n.eq(rotate1.multiply(-1)))) return false; // invert

        return false;
    }

    private collectNodes(start: Position, end: Position): Position[] | null {
        const Vstart = Vector.fromPosition(start);
        const Vend = Vector.fromPosition(end);
        const base = Vstart.sub(Vend);
        // There have to be a check if the base is diagonal or horizontal!!!!
        if (!(base.isHorizontal || base.isDiagonal)) return null;
        if (!base.isInteger) return null;

        const normal = base.normal.round();
        let result: Position[] = [];

        for (let i = new Vector(0, 0); !i.eq(base); i = i.add(normal)) {
            let Vresult = i.clone().add(Vend);
            result.push(Vresult.toPosition());
        }
        result.push(start);
        return result;
    }

    createLine(start: Position, end: Position) {
        const collection = this.collectNodes(start, end);
        const valid = this.isValidNeighbors(collection);
        if (!valid) return;
        for (let i = 0; i < collection!.length; i++) {
            if (i > 0) {
                this.addNodeAndNeighbors(collection![i], collection![i - 1]);
            }
            if (i < collection!.length - 1) {
                this.addNodeAndNeighbors(collection![i], collection![i + 1]);
            }
        }
    }

    isValidNeighbors(newCollection: Position[] | null): boolean {
        if (newCollection === null) return false;
        for (let i = 0; i < newCollection.length; i++) {
            const n = this.getNode(newCollection[i]);
            if (n === undefined) continue;
            console.log(n, newCollection);
            if (i > 0) {
                if (!this.isValidNeighbor(n, newCollection[i - 1]))
                    return false;
            }
            if (i < newCollection.length - 1) {
                if (!this.isValidNeighbor(n, newCollection[i + 1]))
                    return false;
            }
        }
        return true;
    }
}
