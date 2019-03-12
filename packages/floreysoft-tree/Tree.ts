import { LitElement, TemplateResult, html, property, query, customElement, queryAll, CSSResult, css } from 'lit-element';
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js'

export interface TreeNodeManager {
    render(node: TreeNode): TemplateResult

    do(action: string, tree: Tree, context?: any): Promise<TreeNode>
}

export class TreeNode {
    id?: string
    label: string
    open?: boolean
    nodes?: TreeNode[]
    hasNodes?: boolean
    hasMore?: boolean
    actions?: string[]
    detail?: any
}

@customElement("fs-tree")
export class Tree extends LitElement {
    @property({ type: Boolean })
    set open(open: boolean) {
        this._open = open
        if (this.node) {
            this.node.open = open
        }
        this.requestUpdate()
    }

    get open(): boolean {
        return this._open
    }

    nodeManager: TreeNodeManager

    @property() styles: string
    @property({ converter: Object }) node: TreeNode
    @property({ type: Boolean }) hasNodes: boolean
    @property() header: string
    @property({ type: Number, reflect: true }) level: number
    @property({ type: Number, reflect: true }) indent: number
    @property({ type: Array }) actions: string[] | undefined
    @query("section") private _section: HTMLElement
    @query("header") private _header: HTMLElement
    @query("#nodes") private _slot: HTMLSlotElement
    @query("vaadin-context-menu") private _contextMenu: any
    @queryAll(".loader:not([observed])") private _loaders: NodeListOf<HTMLElement>
    @queryAll("fs-tree:not([observed])") private _nestedTrees: NodeListOf<HTMLElement>

    private _open: boolean
    private _maxHeight: number

    private readonly KEYCODE = {
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        UP: 38,
        SPACE: 32
    }

    constructor() {
        super();
        this._open = false
        this._maxHeight = 0
        this.indent = 20
        this.level = 0
    }

    static get styles(): CSSResult[] {
        return [css`
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
        }`]
    }

    render() {
        let leaf = !this.hasNodes
        let templates: TemplateResult[] = [];
        if (this.node) {
            this._open = this.node.open || false
            this.header = this.node.label
            this.actions = this.node.actions
            if (this.node.hasNodes || this.node.nodes) {
                leaf = false
                if (this.node.nodes) {
                    for (let node of this.node.nodes) {
                        console.log("Indent="+this.indent)

                        templates.push(html`<fs-tree level=${this.level+1} indent=${this.indent} .node=${node} .nodeManager=${this.nodeManager}></fs-tree>`)
                    }
                    if (this.node.hasMore) {
                        templates.push(html`<div style="padding-left: ${this.indent*this.level}px" class="loader"><svg style="width:10px" viewBox="0 0 40 40"><path d="M 5,5 L 35,35" /></svg>...</div>`)
                    }
                } else {
                    templates.push(html`<div style="padding-left: ${this.indent*this.level}px" class="loader"><svg style="width:10px" viewBox="0 0 40 40"><path d="M 5,5 L 35,35" /></svg>...</div>`)
                }
            }
        }
        let customHeader: TemplateResult | string = this.nodeManager ? this.nodeManager.render(this.node) : html`<span class="default">${this.header}</span>`
        let header = leaf ? html`<header style="padding-left: ${this.indent*this.level}px" tabIndex="0" @keydown=${(e: KeyboardEvent) => this.keyDown(e)} @click=${this.selected}>${customHeader}</header>` :
            html`<header style="padding-left: ${this.indent*this.level}px" tabIndex="0" @keydown=${(e: KeyboardEvent) => this.keyDown(e)} @click=${this.selected}><svg class="${this.open ? "open" : "closed"}" viewBox="0 0 10 10"><polygon points="2,0 8,5 2,10"></svg>${customHeader}</header>`
        return html`${this.actions ? html`<vaadin-context-menu>${header}</vaadin-context-menu>` : html`${header}`}
        <section class="${this.open ? "open" : "closed"}">
        <slot id="nodes">${templates}</slot>
        </section>`;
    }

    firstUpdated() {
        if (this.styles) {
            let style: HTMLStyleElement = document.createElement("style")
            style.textContent = this.styles
            if (this.renderRoot) {
                this.renderRoot.appendChild(style);
            }
        }
        this._slot.addEventListener("slotchange", e => this.slotChanged())
        let contextMenu = this._contextMenu
        if (contextMenu) {
            contextMenu.renderer = function (root) {
                let that = this
                let listBox = root.firstElementChild;
                if (listBox) {
                    listBox.innerHTML = '';
                } else {
                    listBox = window.document.createElement('vaadin-list-box');
                    root.appendChild(listBox);
                }
                this.actions.forEach(function (name: string) {
                    const item = window.document.createElement('vaadin-item');
                    item.addEventListener('click', function () {
                        that.do(name)
                    })
                    item.textContent = name;
                    listBox.appendChild(item);
                });
            }.bind(this);
        }
    }

    updated() {
        this._slot.assignedNodes().forEach(nestedTree => {
            this.hasNodes = true
            if ( nestedTree instanceof Tree) {
                if (!nestedTree.getAttribute("observed")) {
                    nestedTree.level = this.level+1
                    if( typeof nestedTree.indent === "undefined" ) {
                        nestedTree.indent =  this.indent
                    }
                    nestedTree.addEventListener("stateChanged", (e: CustomEvent) => this.adjustMaxHeight(e))
                    nestedTree.addEventListener("action", (e: CustomEvent) => this.do(e.detail))
                    nestedTree.setAttribute("observed", "true")
                }
            }
        })
        this._nestedTrees.forEach((nestedTree : Tree ) => {
            this.hasNodes = true
            nestedTree.addEventListener("stateChanged", (e: CustomEvent) => this.adjustMaxHeight(e))
            nestedTree.addEventListener("action", (e: CustomEvent) => this.do(e.detail))
            nestedTree.setAttribute("observed", "true")
            nestedTree.level = this.level+1
            if( typeof nestedTree.indent === "undefined" ) {
                nestedTree.indent =  this.indent
            }
        })
        let observer = new IntersectionObserver(this.onLoaderVisible.bind(this), { threshold: 0.1 })
        this._loaders.forEach(loader => this.obverve(observer, loader))
        this.resize()
    }

    obverve(observer: IntersectionObserver, loader: HTMLElement) {
        observer.observe(loader)
        loader.setAttribute("observed", "true")
    }

    selected(e: Event) {
        this.open = !this.open;
        if (this.nodeManager) {
            this.nodeManager.do("selected", this)
        }
    }

    focus() {
        this._header.focus()
    }

    resize() {
        let maxHeight = 0
        if (this._open) {
            maxHeight = this._section.scrollHeight
        }
        this._section.style.maxHeight = maxHeight + "px"
        this.dispatchEvent(new CustomEvent("stateChanged", { detail: { open: this._open, adjustedHeight: Math.max(0, maxHeight - this._maxHeight) } }))
        this._maxHeight = maxHeight
    }

    adjustMaxHeight(event: CustomEvent) {
        this._maxHeight += event.detail.adjustedHeight;
        this._section.style.maxHeight = this._maxHeight + "px"
        this.dispatchEvent(new CustomEvent("stateChanged", { detail: { open: this._open, adjustedHeight: event.detail.adjustedHeight } }))
    }

    async do(action: string) {
        this.node = await this.nodeManager.do(action, this)
        this.requestUpdate()
    }

    protected contextMenu(e: Event) {
        e.stopPropagation()
        e.preventDefault()
        if (this.actions) {
            this.do(this.actions[0])
        }
    }

    protected async slotChanged() {
        this.requestUpdate()
    }

    protected keyDown(event: KeyboardEvent) {
        if (event.altKey) return;
        switch (event.keyCode) {
            case this.KEYCODE.SPACE:
                this.open = !this.open
                break;
            case this.KEYCODE.LEFT:
                this.open = false
                break;
            case this.KEYCODE.RIGHT:
                this.open = true
                break;
            case this.KEYCODE.UP:
                if (this.previousElementSibling) {
                    (<HTMLElement>this.previousElementSibling).focus()
                } else if (this.parentElement) {
                    (<HTMLElement>this.parentElement).focus()
                }
                break;
            case this.KEYCODE.DOWN:
                if (this._open && this.firstElementChild) {
                    (<HTMLElement>this.firstElementChild).focus()
                } else if (this.nextElementSibling) {
                    (<HTMLElement>this.nextElementSibling).focus()
                } else if (this.parentElement && this.parentElement.nextElementSibling) {
                    (<HTMLElement>this.parentElement.nextElementSibling).focus()
                }
                break;
        }
    }

    private onLoaderVisible(changes: any) {
        changes.forEach(change => {
            if (change.intersectionRatio > 0) {
                this.do("load")
            }
        });
    }
}