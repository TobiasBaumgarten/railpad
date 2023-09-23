import Pad from "../Pad";
import { PaintModeButton } from "./DrawModeButton";
import { EditModeButton } from "./EditModeButton";
import { LabelModeButton } from "./LabelModeButton";
import { ModeButton } from "./ModeButton";
import { SaveModeButton } from "./SaveModeButton";
import { ViewModeButton } from "./ViewModeButton";

export default class ModeButtonController {
    pad: Pad;
    mainButtons: ModeButton[] = [];
    viewButton: ViewModeButton;
    mainButtonsDiv: HTMLDivElement;
    viewButtonsDiv: HTMLDivElement;

    constructor(pad: Pad) {
        this.pad = pad;
        this.setUpModeButtons();
    }

    private setUpModeButtons() {
        // Create the divs that will hold the buttons
        this.mainButtonsDiv = document.createElement('div');
        this.mainButtonsDiv.classList.add('overlay', 'main', 'btn-group');
        this.viewButtonsDiv = document.createElement('div');
        this.viewButtonsDiv.classList.add('overlay', 'btn-group');
        this.pad.parent.appendChild(this.mainButtonsDiv);
        this.pad.parent.appendChild(this.viewButtonsDiv);

        // Create the buttons
        this.viewButton = new ViewModeButton(this.pad, true);
        this.mainButtons.push(new EditModeButton(this.pad));
        this.mainButtons.push(new PaintModeButton(this.pad));
        this.mainButtons.push(new LabelModeButton(this.pad));
        this.mainButtons.push(new SaveModeButton(this.pad));

        this.mainButtons.forEach(button => {
            button.button.addEventListener('click', (e) => {
                // css active button
                this.setActiveMainButton(button);
                // add to drawables
                if ('draw' in button) {
                    this.pad.drawables.push(button as any);
                }
            });
            // Add the buttons to the divs
            this.mainButtonsDiv.appendChild(button.button);
        });

        // Add the view button to the view div
        this.viewButtonsDiv.appendChild(this.viewButton.button);
        this.viewButton.button.addEventListener('click', (e) => {
            const change = !this.viewButton.isActive;
            console.log("change", change); 
            this.setVisibilityMainButtons(!change);
            if (change)
                this.setActiveMainButton(this.viewButton);
            else
                this.mainButtons[0].button.click();
        });
    }

    private setActiveMainButton(button?: ModeButton) {
        this.mainButtons.forEach((b) => {
            b.isActive = false;
        });
        this.viewButton.isActive = false;
        if (button)
            button.isActive = true;
    }

    public setVisibilityMainButtons(isVisible: boolean) {
        if (isVisible) {
            this.mainButtonsDiv.classList.remove("hidden");
        }
        else {
            this.mainButtonsDiv.classList.add("hidden");
        }
    }
}