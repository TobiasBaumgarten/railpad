import { PadStyle } from "./Pad/models";
import Pad from "./Pad/Pad";

const divpad = document.getElementById("pad");

const darkTheme : PadStyle = {
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

if (divpad != undefined) {
    let pad = new Pad(divpad, document.body.scrollWidth, document.body.clientHeight);
    pad.run(30);
} else {
    console.error("No pad div")
}


