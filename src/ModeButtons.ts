import { Signal } from "./helper";
const buttonClass = "btn btn-light btn-sm";
const buttonGroupClass = "btn-group";
const activeButton = "active";


export enum ModeButtonsState {
  edit,
  delete,
  label,
  view,
  brush
}

export class ModeButtons {
  private parent: HTMLElement;
  private buttons: HTMLButtonElement[] = [];
  private groupDiv: HTMLDivElement;
  private editButton: HTMLButtonElement;
  private deleteButton: HTMLButtonElement;
  private labelButton: HTMLButtonElement;
  private viewButton: HTMLButtonElement;
  
  private _state : ModeButtonsState;
  brushButton: HTMLButtonElement;
  public get state() : ModeButtonsState {
    return this._state;
  }
//   public set state(v : ModeButtonsState) {
//     this._state = v;
//   }
  
  onChange = new Signal<ModeButtons, ModeButtonsState>();

  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.createButtons();
    this.viewButton.classList.add(activeButton);
    this._state = ModeButtonsState.view;
  }

  private getIcon(name: string) {
    const icon = document.createElement("i");
    const names = name.split(" ");
    names.forEach((n) => icon.classList.add(n));
    return icon;
  }

  private createAButton(iconName: string, state: ModeButtonsState) {
    const b = document.createElement("button");
    b.className = buttonClass;
    b.appendChild(this.getIcon(iconName));
    b.addEventListener("click", (ev) => {
      this.resetActive(b);
      this.handleClick(state);
    });
    this.buttons.push(b);
    return b;
  }

  private resetActive(b: HTMLButtonElement) {
    this.buttons.forEach((btn) => btn.classList.remove(activeButton));
    b.classList.add(activeButton);
  }

  private createButtons() {
    this.groupDiv = document.createElement("div");
    this.groupDiv.className = buttonGroupClass;
    this.groupDiv.classList.add("overlay");
    this.parent.appendChild(this.groupDiv);

    // edit button
    this.editButton = this.createAButton("fa-solid fa-pen", ModeButtonsState.edit);
    this.groupDiv.appendChild(this.editButton);

    // brush button
    this.brushButton = this.createAButton("fa-solid fa-brush", ModeButtonsState.brush);
    this.groupDiv.appendChild(this.brushButton);
    
    // delete button
    this.deleteButton = this.createAButton("fa-solid fa-trash", ModeButtonsState.delete);
    this.groupDiv.appendChild(this.deleteButton);

    // label button
    this.labelButton = this.createAButton("fa-solid fa-font", ModeButtonsState.label);
    this.groupDiv.appendChild(this.labelButton);

    // view button
    this.viewButton = this.createAButton("fa-solid fa-eye", ModeButtonsState.view);
    this.groupDiv.appendChild(this.viewButton);
  }

  private handleClick(state: ModeButtonsState) {
    this._state = state;
    this.onChange.trigger(this, state);
  }
}
