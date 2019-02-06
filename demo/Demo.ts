import { LitElement, TemplateResult, customElement, property, html, query, queryAll, css, CSSResult } from "lit-element";
import { Dialog } from '../packages/floreysoft-dialog'

@customElement("fs-demo")
export class Demo extends LitElement {
    static get styles(): CSSResult[] {
        return [css`
            fs-tabs {
                height: 100px;
            }
            div {
                margin-top: var(--lumo-space-l);
                border-top: 1px solid var(--lumo-primary-color-10pct);
            }
        `]
    }

    render() {
        return html`
        <div style="padding:0 20px">
            <h3>Tabs</h3>
            <p>Supporting keyboard navigation, closeable tabs and simple usage</p>
        </div>
        <fs-tabs>
            <fs-tab label="First">
                <p>Sollted content</p>
            </fs-tab>
            <fs-tab label="Second" selected>
                <ol><li>Structured</li><li>content</li></ol>
            </fs-tab>
            <fs-tab label="Third" closeable>Third tab just text</fs-tab>
        </fs-tabs>
        <div style="padding:0 20px">
            <h3>Dialog</h3>
            <p>Supports dragging and simple header and action configuration</p>
            <vaadin-button @click=${e => this.openDialog("simpleDialog")}>Simple</vaadin-button>
            <vaadin-button @click=${e => this.openDialog("optionsDialog")}>Options</vaadin-button>
            <vaadin-button @click=${e => this.openDialog("errorDialog")}>Error</vaadin-button>
        </div>
        <fs-dialog id="simpleDialog" header="Simple dialog" buttons='["Close"]'>Very simple dialog</fs-dialog>
        <fs-dialog id="optionsDialog" header="Options dialog" buttons='[{ "label" : "Submit", "theme" : "primary"}, { "label" : "Delete", "theme" : "error"}, { "label" : "Close", "theme" : "secondary"}]'>
            Configure buttons with different styles
        </fs-dialog>
        <fs-dialog id="errorDialog" header="Error dialog" theme="error" buttons='[{ "label" : "Got it!", "theme" : "error"}]'>You
            made a big mistake!</fs-dialog>
        <div style="padding:0 20px">
            <h3>Tree</h3>
            <p>Features:</p>
            <ul>
                <li>lazy loading of tree nodes</li>
                <li>lazy loading of children in chunks on scroll</li>
                <li>nice animation on open</li>
                <li>broken keyboard navigation</li>
                <li>individual context actions on nodes</li>
            </ul>
        </div>
        <fs-tree header="My drive" indent=20>
            <fs-tree header="File 1"></fs-tree>
            <fs-tree header="Invoices">
                <fs-tree header="Invoice 123-456"></fs-tree>
                <fs-tree header="Invoice 234-567"></fs-tree>
                <fs-tree header="Invoice 345-123"></fs-tree>
                <fs-tree header="Invoice 456-234"></fs-tree>
            </fs-tree>
            <fs-tree header="File 2"></fs-tree>
            <fs-tree header="File 3"></fs-tree>
            <fs-tree header="File 4"></fs-tree>
        </fs-tree>
        <fs-tree header="Teamdrives" indent=20>
            <fs-tree header="File 1"></fs-tree>
            <fs-tree header="Invoices">
                <fs-tree header="Invoice 123-456"></fs-tree>
                <fs-tree header="Invoice 234-567"></fs-tree>
                <fs-tree header="Invoice 345-123"></fs-tree>
                <fs-tree header="Invoice 456-234"></fs-tree>
            </fs-tree>
            <fs-tree header="File 2"></fs-tree>
            <fs-tree header="File 3"></fs-tree>
            <fs-tree header="File 4"></fs-tree>
        </fs-tree>
        `
    }

    openDialog(id: string) {
        if (this.shadowRoot) {
            (<Dialog>this.shadowRoot.getElementById(id)).open = true
        }

    }
}