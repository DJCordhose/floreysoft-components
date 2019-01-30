import { customElement, LitElement, html, query, property } from "lit-element";
import { ifDefined } from "lit-html/directives/if-defined";

export class DialogButton {
    label : string
    id : string
    theme? : string
}

@customElement("fs-dialog")
export class Dialog extends LitElement {
    @property({type: Array}) buttons: any[]
    @property({type:Boolean, reflect: true}) open : boolean
    @property() header: string
    @property({type: Object}) context : any
    @query("dialog") _dialog: HTMLDialogElement

    render() {
        if ( !this.buttons ) return
        return html`
        <style>
        .backdrop, .dialogWrapper {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 1;
        }
        .backdrop {
            opacity: 0;
            background: rgba(0, 0, 0, .5);
            transition: all ease 0.12s;
        }
        .dialog {
            position: relative;
            display: flex;
            flex-direction: column;
            opacity: 0;
            background-color: #fefefe;
            margin: 15% auto;
            max-height: 80%;
            min-width: 350px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
            z-index: 2;
            transform: scale(0.8);
            transition: 0.14s transform cubic-bezier(.12, .32, .54, 1);
            will-change: transform;
        }
        .backdrop.open {
            opacity: 1;
            pointer-events: auto;
        }
        .dialog.open {
            opacity: 1;
            pointer-events: auto;
            transform: scale(1);
            transition-timing-function: cubic-bezier(.12, .32, .54, 1.5);
        }
        header {
            background-color: var(--lumo-contrast);
            color: var(--lumo-primary-contrast-color);
            font-family: var(--lumo-font-family);
            font-size: var(--lumo-font-size-m);
            padding: var(--lumo-space-m);
        }
        section {
            padding: var(--lumo-space-m);
            overflow-y: auto;
        }
        footer {
            background-color: var(--lumo-contrast-5pct);
            padding: var(--lumo-space-xs) var(--lumo-space-m);
            text-align: right;
        }
        vaadin-button {
            margin-left: var(--lumo-space-s);
        }
        </style>
        <div class="backdrop ${this.open ? "open" : ""}"></div>
        <div class="dialogWrapper">
        <div class="dialog ${this.open ? "open" : ""}">
            <header>${this.header}</header>
            <section><slot></slot></section>
            <footer>${this.buttons.map(button => html`<vaadin-button theme="${ifDefined(typeof button == "string" ? "primary" : button.theme)}" @click=${(e : Event) => this.optionSelected((typeof button == "string" ? button : button.id), this.context)}>${typeof button == "string" ? button : button.label}</vaadin-button>`)}</footer>
        </div></div<`
    }

    optionSelected(option : string, context: any) {
        if (this.dispatchEvent(new CustomEvent('selected', { detail : { option, context}, cancelable: true }))) {
            this.open = false
        }
    }
}