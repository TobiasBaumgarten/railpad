import Renderer from "../Renderer";

/** Interface for objects that can be drawn by a renderer. */
export interface Drawable {
    draw: (renderer: Renderer) => void;
}
