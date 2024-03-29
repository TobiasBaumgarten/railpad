/**
 * Data Model of a Node to be saved 
 */
export interface NodeModel {
    /** Position */
    p: number[];
    /** neigbors */
    n: number[];
    /** description number */
    d?: number;
    /** line color */
    lc?: string;
    /** background color */
    bc?: string;
}
