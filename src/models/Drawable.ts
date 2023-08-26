import Renderer from "../Renderer";

export interface Drawable {
    draw: (renderer: Renderer) => void;
}
