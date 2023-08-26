export class Vector {
    y: number;
    x: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static fromXY(vec): Vector {
        if ("x" in vec && "y" in vec) return new Vector(vec.x, vec.y);
        throw new Error("vector has not the property x and y");
    }

    hash() {
        return `${this.x};${this.y}`;
    }

    get normal(): Vector {
        const mag = this.magnitude;
        let normal = new Vector(0, 0);
        normal.x = this.x == 0 ? 0 : this.x / mag;
        normal.y = this.y == 0 ? 0 : this.y / mag;
        return normal;
    }

    get magnitude(): number {
        return Math.sqrt(this.squaredMagnitude);
    }

    get squaredMagnitude(): number {
        return this.x * this.x + this.y * this.y;
    }

    get isHorizontal(): boolean {
        const abs = this.call(Math.abs);
        return (abs.x >= 1 && abs.y == 0) || (abs.y >= 1 && abs.x == 0);
    }

    get isDiagonal(): boolean {
        const norm = this.normal.call(Math.abs);
        return norm.x == norm.y && norm.x != 0;
    }

    get isInteger(): boolean {
        return Number.isInteger(this.x) && Number.isInteger(this.y);
    }

    add(val: Vector): Vector {
        return new Vector(this.x + val.x, this.y + val.y);
    }

    sub(val: Vector): Vector {
        return new Vector(this.x - val.x, this.y - val.y);
    }

    multiply(val: Vector | number): Vector {
        if (val instanceof Vector) {
            return new Vector(val.x * this.x, this.y * val.y);
        } else if (typeof val === "number") {
            return new Vector(val * this.x, val * this.y);
        }
        throw new Error(`${val} is not a type of number or Vector`);
    }

    div(val: Vector | number): Vector {
        if (val instanceof Vector) {
            return new Vector(val.x / this.x, this.y / val.y);
        } else if (typeof val === "number") {
            return new Vector(this.x / val, this.y / val);
        }
        throw new Error(`${val} is not a type of number or Vector`);
    }

    eq(vector: Vector) {
        return this.x == vector.x && this.y == vector.y;
    }

    call(fc: (xy: number) => number) {
        return new Vector(fc(this.x), fc(this.y));
    }

    floor(): Vector {
        return this.call(Math.floor);
    }

    ceil(): Vector {
        return this.call(Math.ceil);
    }

    round(): Vector {
        return this.call(Math.round);
    }

    rotate(rad: number) {
        return new Vector(
            Math.cos(rad) * this.x - Math.sin(rad) * this.y,
            Math.sin(rad) * this.x + Math.cos(rad) * this.y
        );
    }

    clone(): Vector {
        return new Vector(this.x, this.y);
    }
}
