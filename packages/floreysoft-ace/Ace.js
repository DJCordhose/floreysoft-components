var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, property, query, customElement, LitElement, css } from 'lit-element';
import ace from 'ace-builds/src-min-noconflict/ace.js';
import "./webpack-resolver";
import "ace-builds/src-min-noconflict/mode-javascript";
let Ace = class Ace extends LitElement {
    constructor() {
        super(...arguments);
        this.mode = "javascript";
        this.theme = "tomorrow_night";
        this.gutter = false;
        this.silent = false;
    }
    set value(value) {
        if (this.editor) {
            this.silent = true;
            this.editor.setValue(value, -1);
            this.silent = false;
        }
    }
    static get styles() {
        return [css `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: var(--lumo-border-radius);
      border: 1px solid var(--lumo-contrast-20pct);
      margin: var(--lumo-space-xs) 0;
    }
    #editor {
      height: 100%;
    }`];
    }
    render() {
        return html `<div id="editor"></div>`;
    }
    firstUpdated() {
        this.editor = ace.edit(this.div);
        this.editor.renderer.attachToShadowRoot();
        if (this.value) {
            this.editor.setValue(this.value);
            this.editor.clearSelection();
        }
        this.editor.getSession().on('change', (event) => this.valueChanged());
    }
    updated(changedProperties) {
        this.updateOptions();
    }
    resize() {
        if (this.editor) {
            this.editor.resize();
        }
    }
    valueChanged() {
        if (!this.silent) {
            this.dispatchEvent(new CustomEvent('changed', { detail: { value: this.editor.getValue() } }));
        }
    }
    updateOptions() {
        if (this.editor) {
            this.editor.renderer.setShowGutter(this.gutter);
            this.editor.setTheme("ace/theme/" + this.theme);
            this.editor.session.setMode("ace/mode/" + this.mode);
        }
    }
};
__decorate([
    property({ type: String })
], Ace.prototype, "value", null);
__decorate([
    property()
], Ace.prototype, "mode", void 0);
__decorate([
    property()
], Ace.prototype, "theme", void 0);
__decorate([
    property({ type: Number })
], Ace.prototype, "width", void 0);
__decorate([
    property({ type: Number })
], Ace.prototype, "height", void 0);
__decorate([
    property({ type: Boolean })
], Ace.prototype, "gutter", void 0);
__decorate([
    query("#editor")
], Ace.prototype, "div", void 0);
Ace = __decorate([
    customElement("floreysoft-ace")
], Ace);
export { Ace };
//# sourceMappingURL=Ace.js.map