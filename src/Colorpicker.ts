import { Signal } from "./helper";

export class Colorpicker {
    private button: HTMLButtonElement;
    private dropdown: HTMLDivElement;
    private colors: string[] = [];
    public value: string;
    public onChange: Signal<Colorpicker, string>;

    constructor(element: HTMLElement, colors: string[] = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"]) {
        this.colors = colors
        this.value = '#fff'

        this.onChange = new Signal<Colorpicker, string>();

        // Button erstellen und stylen
        this.button = document.createElement('button');
        this.button.className = "colorpicker-button";
        element.appendChild(this.button);

        // Dropdown erstellen und stylen
        this.dropdown = document.createElement('div');
        this.dropdown.className = "colorpicker-dropdown";
        element.appendChild(this.dropdown);

        this.init();
    }

    private init() {
        // Dropdown mit Farben füllen
        this.colors.forEach(color => {
            const colorElement = document.createElement('div');
            colorElement.className = "color"

            colorElement.style.backgroundColor = color;
            colorElement.addEventListener('click', () => {
                this.button.style.backgroundColor = color;
                this.dropdown.style.display = 'none';
                this.value = color
                this.onChange.trigger(this,color);
            });
            this.dropdown.appendChild(colorElement);
        });

        // Dropdown anzeigen/verstecken
        this.button.addEventListener('click', () => {
            this.dropdown.style.display = this.dropdown.style.display === 'none' ? 'block' : 'none';
        });
    }
}
