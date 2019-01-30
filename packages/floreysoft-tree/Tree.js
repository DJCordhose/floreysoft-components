var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LitElement, html, property, query, customElement, queryAll, css } from 'lit-element';
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';
export class TreeNode {
}
let Tree = class Tree extends LitElement {
    constructor() {
        super();
        this.KEYCODE = {
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39,
            UP: 38,
            SPACE: 32
        };
        this._open = false;
        this._maxHeight = 0;
        this.indent = 0;
        this.level = 0;
    }
    set open(open) {
        this._open = open;
        if (this.node) {
            this.node.open = open;
        }
        this.requestUpdate();
    }
    get open() {
        return this._open;
    }
    static get styles() {
        return [css `
        :host {
            display: block;
        }
        header, .loader {
            width: 100%;
            text-align: left;
            box-sizing: border-box;
            font-family: var(--lumo-font-family);
            font-size: var(--lumo-font-size-m);
            font-weight: 500;
            color: var(--lumo-primary-color);       
            outline: none;
            padding: var(--lumo-space-xs);   
        }
        header span {
            user-select: none
            margin-left: var(--lumo-space-s);         
        }
        header .default {
            vertical-align: middle;
            margin-left: 4px;
        }
        header:focus {
            color: var(--lumo-contrast-color); 
            background-color: var(--lumo-shade-10pct);
        }
        svg {
            width: 10px;
            vertical-align: middle;
            fill: var(--lumo-primary-color);
            transition: .2s all ease-out; 
            margin-left: var(--lumo-space-s);         
        }
        .leaf {
            
        }
        svg.open {
            transform: rotate(90deg);
        }
        section {
            transition: max-height .2s ease-out;
            overflow: hidden;
        }
        .loader svg {
            margin-right: var(--lumo-space-s);
        }
        path {
            stroke: var(--lumo-primary-color);
            fill: transparent;
            stroke-linecap: round;
            stroke-width: 8;
            transform-origin: center;
            animation: rotating 0.6s linear infinite;
        }         
        @keyframes rotating {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
        }`];
    }
    render() {
        let leaf = !this.hasNodes;
        let templates = [];
        if (this.node) {
            this._open = this.node.open || false;
            this.header = this.node.label;
            this.actions = this.node.actions;
            if (this.node.hasNodes || this.node.nodes) {
                leaf = false;
                if (this.node.nodes) {
                    for (let node of this.node.nodes) {
                        templates.push(html `<fs-tree level=${this.level + 1} indent=${this.indent} .node=${node} .nodeManager=${this.nodeManager}></fs-tree>`);
                    }
                    if (this.node.hasMore) {
                        templates.push(html `<div style="padding-left: ${this.indent * this.level}px" class="loader"><svg style="width:10px" viewBox="0 0 40 40"><path d="M 5,5 L 35,35" /></svg>...</div>`);
                    }
                }
                else {
                    templates.push(html `<div style="padding-left: ${this.indent * this.level}px" class="loader"><svg style="width:10px" viewBox="0 0 40 40"><path d="M 5,5 L 35,35" /></svg>...</div>`);
                }
            }
        }
        let customHeader = this.nodeManager ? this.nodeManager.render(this.node) : html `<span class="default">${this.header}</span>`;
        let header = leaf ? html `<header style="padding-left: ${this.indent * this.level}px" tabIndex="0" @keydown=${(e) => this.keyDown(e)} @click=${this.selected}>${customHeader}</header>` :
            html `<header style="padding-left: ${this.indent * this.level}px" tabIndex="0" @keydown=${(e) => this.keyDown(e)} @click=${this.selected}><svg class="${this.open ? "open" : "closed"}" viewBox="0 0 10 10"><polygon points="2,0 8,5 2,10"></svg>${customHeader}</header>`;
        return html `${this.actions ? html `<vaadin-context-menu>${header}</vaadin-context-menu>` : html `${header}`}
        <section class="${this.open ? "open" : "closed"}">
        <slot id="nodes">${templates}</slot>
        </section>`;
    }
    firstUpdated() {
        if (this.styles) {
            let style = document.createElement("style");
            style.textContent = this.styles;
            if (this.renderRoot) {
                this.renderRoot.appendChild(style);
            }
        }
        this._slot.addEventListener("slotchange", e => this.slotChanged());
        let contextMenu = this._contextMenu;
        if (contextMenu) {
            contextMenu.renderer = function (root) {
                let that = this;
                let listBox = root.firstElementChild;
                if (listBox) {
                    listBox.innerHTML = '';
                }
                else {
                    listBox = window.document.createElement('vaadin-list-box');
                    root.appendChild(listBox);
                }
                this.actions.forEach(function (name) {
                    const item = window.document.createElement('vaadin-item');
                    item.addEventListener('click', function () {
                        that.do(name);
                    });
                    item.textContent = name;
                    listBox.appendChild(item);
                });
            }.bind(this);
        }
    }
    updated() {
        this._slot.assignedNodes().forEach(nestedTree => {
            this.hasNodes = true;
            if (nestedTree instanceof Element) {
                if (!nestedTree.getAttribute("observed")) {
                    nestedTree.addEventListener("stateChanged", (e) => this.adjustMaxHeight(e));
                    nestedTree.addEventListener("action", (e) => this.do(e.detail));
                    nestedTree.setAttribute("observed", "true");
                }
            }
        });
        this._nestedTrees.forEach(nestedTree => {
            this.hasNodes = true;
            nestedTree.addEventListener("stateChanged", (e) => this.adjustMaxHeight(e));
            nestedTree.addEventListener("action", (e) => this.do(e.detail));
            nestedTree.setAttribute("observed", "true");
        });
        let observer = new IntersectionObserver(this.onLoaderVisible.bind(this), { threshold: 0.1 });
        this._loaders.forEach(loader => this.obverve(observer, loader));
        this.resize();
    }
    obverve(observer, loader) {
        observer.observe(loader);
        loader.setAttribute("observed", "true");
    }
    selected(e) {
        this.open = !this.open;
        if (this.nodeManager) {
            this.nodeManager.do("selected", this);
        }
    }
    focus() {
        this._header.focus();
    }
    resize() {
        let maxHeight = 0;
        if (this._open) {
            maxHeight = this._section.scrollHeight;
        }
        this._section.style.maxHeight = maxHeight + "px";
        this.dispatchEvent(new CustomEvent("stateChanged", { detail: { open: this._open, adjustedHeight: Math.max(0, maxHeight - this._maxHeight) } }));
        this._maxHeight = maxHeight;
    }
    adjustMaxHeight(event) {
        this._maxHeight += event.detail.adjustedHeight;
        this._section.style.maxHeight = this._maxHeight + "px";
        this.dispatchEvent(new CustomEvent("stateChanged", { detail: { open: this._open, adjustedHeight: event.detail.adjustedHeight } }));
    }
    do(action) {
        return __awaiter(this, void 0, void 0, function* () {
            this.node = yield this.nodeManager.do(action, this);
            this.requestUpdate();
        });
    }
    contextMenu(e) {
        e.stopPropagation();
        e.preventDefault();
        if (this.actions) {
            this.do(this.actions[0]);
        }
    }
    slotChanged() {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestUpdate();
        });
    }
    keyDown(event) {
        if (event.altKey)
            return;
        switch (event.keyCode) {
            case this.KEYCODE.SPACE:
                this.open = !this.open;
                break;
            case this.KEYCODE.LEFT:
                this.open = false;
                break;
            case this.KEYCODE.RIGHT:
                this.open = true;
                break;
            case this.KEYCODE.UP:
                if (this.previousElementSibling) {
                    this.previousElementSibling.focus();
                }
                else if (this.parentElement) {
                    this.parentElement.focus();
                }
                break;
            case this.KEYCODE.DOWN:
                if (this._open && this.firstElementChild) {
                    this.firstElementChild.focus();
                }
                else if (this.nextElementSibling) {
                    this.nextElementSibling.focus();
                }
                else if (this.parentElement && this.parentElement.nextElementSibling) {
                    this.parentElement.nextElementSibling.focus();
                }
                break;
        }
    }
    onLoaderVisible(changes) {
        changes.forEach(change => {
            if (change.intersectionRatio > 0) {
                this.do("load");
            }
        });
    }
};
__decorate([
    property({ type: Boolean })
], Tree.prototype, "open", null);
__decorate([
    property()
], Tree.prototype, "styles", void 0);
__decorate([
    property({ converter: Object })
], Tree.prototype, "node", void 0);
__decorate([
    property({ type: Boolean })
], Tree.prototype, "hasNodes", void 0);
__decorate([
    property()
], Tree.prototype, "header", void 0);
__decorate([
    property({ type: Number })
], Tree.prototype, "level", void 0);
__decorate([
    property({ type: Number })
], Tree.prototype, "indent", void 0);
__decorate([
    property({ type: Array })
], Tree.prototype, "actions", void 0);
__decorate([
    query("section")
], Tree.prototype, "_section", void 0);
__decorate([
    query("header")
], Tree.prototype, "_header", void 0);
__decorate([
    query("#nodes")
], Tree.prototype, "_slot", void 0);
__decorate([
    query("vaadin-context-menu")
], Tree.prototype, "_contextMenu", void 0);
__decorate([
    queryAll(".loader:not([observed])")
], Tree.prototype, "_loaders", void 0);
__decorate([
    queryAll("fs-tree:not([observed])")
], Tree.prototype, "_nestedTrees", void 0);
Tree = __decorate([
    customElement("fs-tree")
], Tree);
export { Tree };
//# sourceMappingURL=Tree.js.map