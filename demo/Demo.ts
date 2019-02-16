import { LitElement, customElement, property, html, css, CSSResult } from "lit-element";
import { Dialog } from '@floreysoft/dialog'
import { VaadinFieldFactory } from '@floreysoft/formsey-fields-vaadin'

@customElement("fs-demo-section")
export class DemoSection extends LitElement {
    @property() title: string
    @property() npm : string
    @property() github : string
    @property() minified : string
    @property() gzipped : string

    static get styles(): CSSResult[] {
        return [css`
            :host {
                display: block;
                margin-top: var(--lumo-space-l);
                border-top: var(--lumo-space-m) solid var(--lumo-primary-color-10pct);
                padding: 0 var(--lumo-space-m);
            }
            h3 {
                margin: var(--lumo-space-l) 0 0 0
            }
            a {
                color: var(--lumo-primary-color);
            }
            svg {
                vertical-align: text-top;
            }
        `]
    }

    render() {
        return html`
        <h3>${this.title} <a class="icon" href="${this.github}" title="GitHub">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentcolor">
                <path d="M12,2C6.48,2,2,6.59,2,12.25c0,4.53,2.87,8.37,6.84,9.73c0.5,0.09,0.68-0.22,0.68-0.49c0-0.24-0.01-0.89-0.01-1.74c-2.78,0.62-3.37-1.37-3.37-1.37c-0.45-1.18-1.11-1.5-1.11-1.5c-0.91-0.64,0.07-0.62,0.07-0.62c1,0.07,1.53,1.06,1.53,1.06c0.89,1.57,2.34,1.11,2.91,0.85c0.09-0.66,0.35-1.11,0.63-1.37c-2.22-0.26-4.56-1.14-4.56-5.07c0-1.12,0.39-2.03,1.03-2.75c-0.1-0.26-0.45-1.3,0.1-2.71c0,0,0.84-0.28,2.75,1.05c0.8-0.23,1.65-0.34,2.5-0.34c0.85,0,1.7,0.12,2.5,0.34c1.91-1.33,2.75-1.05,2.75-1.05c0.55,1.41,0.2,2.45,0.1,2.71c0.64,0.72,1.03,1.63,1.03,2.75c0,3.94-2.34,4.81-4.57,5.06c0.36,0.32,0.68,0.94,0.68,1.9c0,1.37-0.01,2.48-0.01,2.81c0,0.27,0.18,0.59,0.69,0.49c3.97-1.36,6.83-5.2,6.83-9.73C22,6.59,17.52,2,12,2"></path>
            </svg>
        </a></h3>
        <code>${this.npm}</code>
        <slot></slot>
        <p>Size: <a href="https://bundlephobia.com/result?p=${this.npm}" target="_size">${this.minified} kB (minified), ${this.gzipped} kB (gzipped)</a></p>`
    }
}

@customElement("fs-demo")
export class Demo extends LitElement {
    static get styles(): CSSResult[] {
        return [css`
            fs-tabs {
                height: 100px;
            }
        `]
    }

    render() {
        return html`
        <fs-demo-section title="Tabs" npm="@floreysoft/tabs" github="https://github.com/floreysoft/floreysoft-components/tree/master/packages/floreysoft-tabs" minified="4.47" gzipped="1.5">
        <p>Supporting keyboard navigation, closeable tabs and simple usage.</p>
        </fs-demo-section>
        <fs-tabs>
            <fs-tab label="First">
                <p>Sollted content</p>
            </fs-tab>
            <fs-tab label="Second" selected>
                <ol><li>Structured</li><li>content</li></ol>
            </fs-tab>
            <fs-tab label="Third" closeable>Third tab just text</fs-tab>
        </fs-tabs>
        <fs-demo-section title="Dialog" npm="@floreysoft/dialog" github="https://github.com/floreysoft/floreysoft-components/tree/master/packages/floreysoft-dialog" minified="2.86" gzipped="0.8">
        <p>Supports dragging and simple header and action configuration</p>
        <vaadin-button @click=${e => this.openDialog("simpleDialog")}>Simple</vaadin-button>
        <vaadin-button @click=${e => this.openDialog("optionsDialog")}>Options</vaadin-button>
        <vaadin-button @click=${e => this.openDialog("errorDialog")}>Error</vaadin-button>
        </fs-demo-section>
        <fs-dialog id="simpleDialog" header="Simple dialog" buttons='["Close"]'>Very simple dialog</fs-dialog>
        <fs-dialog id="optionsDialog" header="Options dialog" buttons='[{ "label" : "Submit", "theme" : "primary"}, { "label" : "Delete", "theme" : "error"}, { "label" : "Close", "theme" : "secondary"}]'>
            Configure buttons with different styles
        </fs-dialog>
        <fs-dialog id="errorDialog" header="Error dialog" theme="error" buttons='[{ "label" : "Got it!", "theme" : "error"}]'>You 've made a big mistake!</fs-dialog>
        <fs-demo-section title="Tree" npm="@floreysoft/tree" github="https://github.com/floreysoft/floreysoft-components/tree/master/packages/floreysoft-tree" minified="" gzipped="">
        <p>Lazy loading of tree nodes, lazy loading of children in chunks on scroll, nice animation on open, individual context actions on nodes</p>
        </fs-demo-section>
        <fs-tree header="My drive">
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
        <fs-tree header="Teamdrives">
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
        <fs-demo-section title="Form" npm="@floreysoft/formsey-core" github="https://github.com/floreysoft/floreysoft-components/tree/master/packages/formsey-core" minified="" gzipped="">
        <p>Formsey</p>
        <fs-form src="https://www.formsey.com/form/25eKDUrAPVnTm2yM0WoK.json" .factory="${new VaadinFieldFactory()}"></fs-form>
        <fs-dialog id="formDialog" header="Enter form" buttons='[{ "label" : "Submit", "theme" : "primary"}, { "label" : "Cancel", "theme" : "secondary"}]'>
           <fs-form src="https://www.formsey.com/form/25eKDUrAPVnTm2yM0WoK.json" .factory="${new VaadinFieldFactory()}"></fs-form>
        </fs-dialog>
        <vaadin-button @click=${e => this.openDialog("formDialog")}>Show form</vaadin-button>
        </fs-demo-section>
        `
    }

    openDialog(id: string) {
        if (this.shadowRoot) {
            (<Dialog>this.shadowRoot.getElementById(id)).open = true
        }

    }
}