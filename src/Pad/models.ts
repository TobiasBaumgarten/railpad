import Renderer from "./Renderer";

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

export enum NodeState {
    default = 0,
    deconstruct = 1,
    build = 2,
    builded = 3,
    ghost = 4,
}

export interface VectorModel {
    x: number;
    y: number;
}

export interface Position {
    position: VectorModel;
}

export interface NodeModel extends Position{
    neighbors: VectorModel[];
}

export interface NodeStateModel extends NodeModel {
    state: NodeState;
}

export interface StateModel extends Position {
    state: NodeState;
}

export interface StateMapModel {
    name: string;
    states: StateModel[];
}

export interface NodeMap {
    name: string;
    nodes: NodeModel[];
    stateMaps: StateMapModel[];
}
