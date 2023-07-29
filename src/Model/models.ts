import Renderer from "../View/Renderer";

export interface Position {
    x: number;
    y: number;
}

export enum NodeState {
    default = 0,
    deconstruct = 1,
    build = 2,
    builded = 3,
    ghost = 4,
}

export interface Node {
    position: Position;
    neighbors: Position[] | undefined;
    state: NodeState | undefined;
}

export class PadStyle {
    backgroundColor: string;
    dotColor: string;
    dotSelectColor: string;
    dotHoverColor: string;
    nodeLineDefault: string;
    nodeLineDeconstruct: string;
    nodeLineBuild: string;
    nodeLineBuilded: string;
    nodeLineGhost: string;
}

export interface Drawable {
    draw: (renderer: Renderer) => void;
}
