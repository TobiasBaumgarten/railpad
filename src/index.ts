import { PadStyle } from "./Pad/models";
import Pad from "./Pad/Pad";

const divpad = document.getElementById("app");

const darkTheme: PadStyle = {
    backgroundColor: "black",
    dotColor: "white",
    dotSelectColor: "yellow",
    dotHoverColor: "red",
    nodeLineDefault: "white",
    nodeLineDeconstruct: "yellow",
    nodeLineBuild: "red",
    nodeLineBuilded: "green",
    nodeLineGhost: "gray"
}


window.addEventListener("load", () => {
    if (divpad != undefined) {
        console.log()
        let pad = new Pad(divpad);
        pad.run(30);
    } else {
        console.error("No pad div")
    }
})



