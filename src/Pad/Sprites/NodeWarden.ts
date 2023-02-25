import { Action, Signal, debounce } from "../helper";
import { Drawable, NodeState, PadStyle, Vector } from "../models";
import Renderer from "../Renderer";
import Node from "./Node";

export default class NodeWarden implements Drawable {
    startCreate: Vector;
    endCreate: Vector;
    activeCreation: boolean = false;
    onCreateNote: Action<Node[]>;
    onInvalidCreation = new Signal<NodeWarden, Node>();
    nodes: Node[] = []
    private validColor: string = "red";
    // this property give the possibility to allow node creation or disallow. 

    constructor() {
    }

    reset(): void {
        this.activeCreation = false;
    }

    /**
     * Checks if the any note has the position
     * @param position the vector to check if its in the nodes
     * @returns true if there is a note that has the position
     */
    isNodeIn(position: Vector) {
        return this.nodes.some(n => n.position.eq(position))
    }

    getNode(position: Vector): Node | undefined {
        return this.nodes.find(n => n.position.eq(position));
    }

    private addNodeAndNeighbor(node: Vector, neighbor: Vector) {
        // const valid = this.isValidNeighbors(node, neighbor);
        // if(!valid) {
        //     this.onInvalidCreation.trigger(this, new Node(node, this.style));
        // }

        let parent = this.getNode(node);
        if (parent == undefined) {
            parent = new Node(node);
            this.nodes.push(parent);
        }
        parent.addNeighbors(neighbor);
    }

    isValidNeighbors(newCollection: Vector[] | null): boolean {
        if (newCollection === null)
            return false;
        for (let i = 0; i < newCollection.length; i++) {
            const n = this.getNode(newCollection[i]);
            if (n === undefined) continue;
            console.log(n, newCollection)
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

    private collectNodes(start: Vector, end: Vector): Vector[] | null {
        const base = start.sub(end);
        // There have to be a check if the base is diagonal or horizontal!!!!
        if (!(base.isHorizontal || base.isDiagonal))
            return null;
        if (!base.isInteger)
            return null;
        const normal = base.normal.round();
        let result: Vector[] = [];

        for (let i = new Vector(0, 0); !i.eq(base); i = i.add(normal)) {
            result.push(i.clone().add(end));
        }
        result.push(start);
        return result;
    }



    create(node: Vector) {
        const collection = this.collectNodes(this.startCreate, node);
        const valid = this.isValidNeighbors(collection);
        if (!valid) return;
        for (let i = 0; i < collection!.length; i++) {
            if (i > 0) {
                this.addNodeAndNeighbor(collection![i], collection![i - 1])
            }
            if (i < collection!.length - 1) {
                this.addNodeAndNeighbor(collection![i], collection![i + 1])
            }
        }

        this.reset();
    }



    draw(renderer: Renderer): void {
        this.nodes.forEach(n => n.draw(renderer));

        if (!this.activeCreation) return;

        debounce(this.setValidColor(), 500);
        renderer.drawLine(this.startCreate, this.endCreate, this.validColor);
    }


    private setValidColor() {
        const collection = this.collectNodes(this.startCreate, this.endCreate);
        const valid = this.isValidNeighbors(collection);
        this.validColor = valid ? "green" : "red";
    }
}