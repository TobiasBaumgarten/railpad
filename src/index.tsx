import { PadStyle } from "./Pad/models";
import Pad from "./Pad/Pad";
import { createRoot } from "react-dom/client";
import React, { useRef } from "react";


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

class App extends React.Component {
    myRef: React.RefObject<HTMLDivElement>;
    pad: Pad;

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    override componentDidMount(): void {
        this.pad = new Pad(this.myRef.current!);
        this.pad.run();
    }

    render(): React.ReactNode {
        return <div>
            <h1>Hello</h1>
            <div id="pad" ref={this.myRef}></div>
        </div>
    }
}


const root = createRoot(divpad!);
root.render(<App />);



