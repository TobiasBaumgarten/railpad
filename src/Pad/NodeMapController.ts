import NodeWarden from "./Sprites/NodeWarden";
import Node from "./Sprites/Node";
import { NodeMap, NodeState, Position, StateMapModel } from "./models";
import { Vector } from "./Vector";

export class NodeMapController {
    warden: NodeWarden;
    nodeMaps: NodeMap[];
    currentMapName: string;
    currentStateName: string | undefined;

    constructor(nodeWarden: NodeWarden) {
        this.warden = nodeWarden;
        this.nodeMaps = [];
    }

    createNewMap(name: string) {
        const nameExists = this.nodeMaps.some((n) => n.name == name);
        if (nameExists) {
            throw new Error("The Name already exists");
        }
        const newMap: NodeMap = {
            name: name,
            nodes: [],
            stateMaps: [],
        };
        this.nodeMaps.push(newMap);
    }

    sort() {
        let sorted: NodeMap[] = [];
        this.nodeMaps.forEach((nm) => {
            let ySorted = nm.nodes.sort((a, b) => a.position.y - b.position.y);
            let positionSorted = ySorted.sort((a, b) => a.position.x - b.position.x);
            let sortedSM: StateMapModel[] = []
            nm.stateMaps.forEach(sm => {
                let smy = sm.states.sort((a, b) => a.position.y - b.position.y);
                let smAll = smy.sort((a, b) => a.position.x - b.position.x);
                sortedSM.push({name:sm.name, states: smAll});
            })
            sorted.push({
                name: nm.name,
                nodes: positionSorted,
                stateMaps: sortedSM,
            });
        });
        this.nodeMaps = sorted;
    }

    setMap(name: string, stateName: string | undefined = undefined) {
        const map = this.nodeMaps.find((m) => m.name == name);
        if (map === undefined) {
            throw new Error(`The Map "${name}" doesn't exists`);
        }

        let setMap: Node[] = [];
        const stateMap = stateName
            ? undefined
            : map.stateMaps.find((sm) => sm.name == stateName);
        map.nodes.forEach((m) => {
            const state =
                stateMap == undefined
                    ? NodeState.build
                    : stateMap.states.find((s) => s.position == m.position)
                          ?.state;
            const neighbors = m.neighbors == undefined ? [] : m.neighbors;
            setMap.push(
                new Node(
                    Vector.fromPosition(m.position),
                    neighbors.map((n) => Vector.fromPosition(n)),
                    state
                )
            );
        });
        this.warden.nodes = setMap;
        this.currentMapName = name;
        this.currentStateName = stateName;
    }

    private getCurrentMap(): Node[] {
        return this.warden.nodes;
    }
}
