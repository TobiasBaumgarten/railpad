import NodeModel from "../Model/NodeModel";
import Renderer from "../Pad/Renderer";
import { Vector } from "../Pad/Vector";
import { Drawable, NodeState, PadStyle, Position, Node } from "../Pad/models";

export default class NodeView {
    style: PadStyle;
    renderer: Renderer;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
        this.style = this.renderer.padStyle;
    }

    draw(nodes: Node[]): void {
        nodes.forEach((node) => {
            node.neighbors?.forEach((neigh) => {
                this.renderer.drawLine(
                    Vector.fromPosition(node.position),
                    this.calcHalfPosition(node, neigh),
                    this.getStyle(node.state)
                );
            });
        });
    }

    getStyle(state = NodeState.default): string {
        switch (state) {
            case NodeState.build:
                return this.style.nodeLineBuild;
            case NodeState.builded:
                return this.style.nodeLineBuilded;
            case NodeState.deconstruct:
                return this.style.nodeLineDeconstruct;
            case NodeState.ghost:
                return this.style.nodeLineGhost;
            default:
                return this.style.nodeLineDefault;
        }
    }

    private calcHalfPosition(node: Node, neighbor: Position) {
        let vectorNode = Vector.fromPosition(node.position);
        let vectorNeighbor = Vector.fromPosition(neighbor);
        return vectorNode.add(vectorNeighbor).div(2);
    }
}
