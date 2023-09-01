/**
 * A class to represent a vector
 */
export class Vector {
    y: number;
    x: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /** Creates a vector from a object with x and  */
    public static fromXY(vec): Vector {
        if ("x" in vec && "y" in vec) return new Vector(vec.x, vec.y);
        throw new Error("vector has not the property x and y");
    }

    /**
     * Creates a string representation of the vector
     * @returns A string representation of the vector
     */
    hash() {
        return `${this.x};${this.y}`;
    }

    /** returns a normalized vector */
    get normal(): Vector {
        const mag = this.magnitude;
        let normal = new Vector(0, 0);
        normal.x = this.x == 0 ? 0 : this.x / mag;
        normal.y = this.y == 0 ? 0 : this.y / mag;
        return normal;
    }

    /** returns the magitude of the vector */
    get magnitude(): number {
        return Math.sqrt(this.squaredMagnitude);
    }

    /** returns the squared magitude of the vector */
    get squaredMagnitude(): number {
        return this.x * this.x + this.y * this.y;
    }

    /** check if the vector is horizontal */
    get isHorizontal(): boolean {
        const abs = this.call(Math.abs);
        return (abs.x >= 1 && abs.y == 0) || (abs.y >= 1 && abs.x == 0);
    }

    /** check if the vector is diagonal */
    get isDiagonal(): boolean {
        const norm = this.normal.call(Math.abs);
        return norm.x == norm.y && norm.x != 0;
    }

    /** check if the vector is a integer vector */
    get isInteger(): boolean {
        return Number.isInteger(this.x) && Number.isInteger(this.y);
    }

    /** addition */
    add(val: Vector): Vector {
        return new Vector(this.x + val.x, this.y + val.y);
    }

    /** subtract */
    sub(val: Vector): Vector {
        return new Vector(this.x - val.x, this.y - val.y);
    }

    /** multiply */
    multiply(val: Vector | number): Vector {
        if (val instanceof Vector) {
            return new Vector(val.x * this.x, this.y * val.y);
        } else if (typeof val === "number") {
            return new Vector(val * this.x, val * this.y);
        }
        throw new Error(`${val} is not a type of number or Vector`);
    }

    /** division */
    div(val: Vector | number): Vector {
        if (val instanceof Vector) {
            return new Vector(val.x / this.x, this.y / val.y);
        } else if (typeof val === "number") {
            return new Vector(this.x / val, this.y / val);
        }
        throw new Error(`${val} is not a type of number or Vector`);
    }

    /** check if the vector is equal to the other vector */
    eq(vector: Vector) {
        return this.x == vector.x && this.y == vector.y;
    }

    /** calls a function with the given vector */
    call(fc: (xy: number) => number) {
        return new Vector(fc(this.x), fc(this.y));
    }

    /** floors the vector */
    floor(): Vector {
        return this.call(Math.floor);
    }

    /** ceils the vector */
    ceil(): Vector {
        return this.call(Math.ceil);
    }

    /** rounds the vector */
    round(): Vector {
        return this.call(Math.round);
    }

    /** rotates the vector */
    rotate(rad: number) {
        return new Vector(
            Math.cos(rad) * this.x - Math.sin(rad) * this.y,
            Math.sin(rad) * this.x + Math.cos(rad) * this.y
        );
    }

    /** clones the vector */
    clone(): Vector {
        return new Vector(this.x, this.y);
    }
}
