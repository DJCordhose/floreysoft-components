import { LitElement, TemplateResult, customElement, property, html, query, queryAll, css, CSSResult } from "lit-element";

@customElement("fs-tab")
export class Tab extends LitElement {
    @property()
    id: string;

    @property()
    label: string;

    @property({ type: Boolean, reflect: true })
    selected: boolean

    @property({ type: Boolean })
    closeable: boolean

    static get styles() : CSSResult[] {
        return [css`
        :host {
            display: none;
            height: 100%;
        }
        :host([selected]) {
            display: block;
        }
        `]
    }

    render() {
        if (!this.id) {
            this.id = this.label
        }
        return html`<slot></slot>`
    }
}

@customElement("fs-tabs")
export class Tabs extends LitElement {
    @property()
    set selected(selected: string) {
        for (let tab of this.tabs) {
            tab.selected = tab.id === selected
        }
        if (this._selected != selected) {
            this._selected = selected
            this.dispatchEvent(new CustomEvent("select", { detail: selected }))
            this.requestUpdate()
        }
    }

    get selected() {
        return this._selected
    }
    
    get tabs() : Tab[] {
        return Array.from(this.querySelectorAll('fs-tab'))
    }

    @query("slot")
    private _slot: HTMLSlotElement
    private _selected: string

    private readonly KEYCODE = {
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        UP: 38,
        HOME: 36,
        END: 35,
    }

    static get styles() : CSSResult[] {
        return [css`
        .tabs {
            display: flex;
            flex-wrap: wrap;
            box-shadow: inset 0 -1px 0 0 var(--lumo-contrast-10pct);
            position: relative;        
        }
        .tab {
            color: var(--lumo-tertiary-text-color);
            box-sizing: border-box;
            padding: 0.5rem 0.75rem;
            font-family: var(--lumo-font-family);
            font-size: var(--lumo-font-size-m);
            line-height: var(--lumo-line-height-xs);
            font-weight: 500;
            text-align: center;
            opacity: 1;
            color: var(--lumo-contrast-60pct);
            transition: 0.15s color, 0.2s transform;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            position: relative;
            cursor: pointer;
            transform-origin: 50% 100%;
            outline: none;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow: hidden;
            min-width: var(--lumo-size-m);
        }        
        .tab.selected {
            color: var(--lumo-primary-text-color);
            transition: 0.6s color;
        }
        .tab::before, .tab::after {
            content: "";
            position: absolute;
            display: var(--_lumo-tab-marker-display, block);
            bottom: 0;
            left: 50%;
            width: var(--lumo-size-s);
            height: 2px;
            background-color: var(--lumo-contrast-60pct);
            border-radius: var(--lumo-border-radius) var(--lumo-border-radius) 0 0;
            transform: translateX(-50%) scale(0);
            transform-origin: 50% 100%;
            transition: 0.14s transform cubic-bezier(.12, .32, .54, 1);
            will-change: transform;
        }        
        .tab.selected::before, .tab.selected::after {
            transform: translateX(-50%) scale(1);
            transition-timing-function: cubic-bezier(.12, .32, .54, 1.5);
            background-color: var(--lumo-primary-color);
        }
        .close {
            display: inline-block;
            border-radius: 50%;
            transition: .1s all linear; 
            margin-left: 5px;
            width: 1em;
            height: 1em;
            line-height: 1;
        }
        .close-x {
            stroke: var(--lumo-tertiary-text-color);
            fill: transparent;
            stroke-linecap: round;
            stroke-width: 6;
            transition: .1s all linear; 
        }
        .close:hover {
            background: var(--lumo-contrast-10pct);
        }
        .close:hover .close-x {
            stroke: var(--lumo-primary-text-color);
        }
        svg {
            width: 0.6em;
            height: 0.6em;
            padding: 0.1em;
        }
        .content {
            flex-grow: 1;
            position: relative;
        }
        :host {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
        }
        ::slotted(fs-tab) {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }`]
    }
    
    render() {
        let templates: TemplateResult[] = [];
        for (let tab of this.tabs) {
            const close = tab.closeable ? html`<div class="close" @click=${(e: Event) => this.close(e, tab)}><svg viewBox="0 0 40 40"><path class="close-x" d="M 5,5 L 35,35 M 35,5 L 5,35" /></svg></div>` : html``
            templates.push(html`<div tabIndex="0" @keydown=${(e: KeyboardEvent) => this.keyDown(e, tab)} @click=${(e: Event) => this.selected = tab.id} class="tab ${tab.selected ? "selected" : ""}">${tab.label}${close}</div>`)
        }
        return html`<div class="tabs">${templates}</div><div class="content"><slot></slot></div>`
    }

    getTab(id: string) : Tab | undefined {
        return this.tabs.find(tab => tab.id == id);
    }

    firstUpdated() {
        this._slot.addEventListener("slotchange", e => this.slotChanged(e))
    }

    close(e: Event, tab: Tab) {
        e.stopPropagation()
        if (this.dispatchEvent(new CustomEvent("beforeclose", { detail: tab, cancelable: true }))) {
            if (tab.selected) {
                this.selected = tab.nextElementSibling ? tab.nextElementSibling.id : tab.previousElementSibling ? tab.previousElementSibling.id : "";
            }
            tab.remove()
            this.requestUpdate();
            this.dispatchEvent(new CustomEvent("close", { detail: tab }));
        }
    }

    hasTab(id: string): boolean {
        return this.tabs.filter(tab => tab.id === id).length > 0;
    }

    private slotChanged(e: Event) {
        for (let tab of this.tabs) {
            if (tab.selected && this._selected != tab.id) {
                this.selected = tab.id
                return true;
            }
        }
        this.requestUpdate();
    }

    private keyDown(event: KeyboardEvent, tab: Tab) {
        if (event.altKey) return;
        let newTab: HTMLElement | null
        let newTarget: HTMLElement | null = event.currentTarget as HTMLElement
        switch (event.keyCode) {
            case this.KEYCODE.LEFT:
            case this.KEYCODE.UP:
                newTab = tab.previousElementSibling as HTMLElement
                newTarget = newTarget ? newTarget.previousElementSibling as HTMLElement : null
                break;
            case this.KEYCODE.RIGHT:
            case this.KEYCODE.DOWN:
                newTab = tab.nextElementSibling as HTMLElement
                newTarget = newTarget ? newTarget.nextElementSibling as HTMLElement : null
                break;
            case this.KEYCODE.HOME:
                newTab = tab.parentElement ? (<HTMLElement>tab.parentElement).firstElementChild as HTMLElement : null
                newTarget = newTarget ? newTarget.parentElement ? (<HTMLElement>newTarget.parentElement).firstElementChild as HTMLElement : null : null
                break;
            case this.KEYCODE.END:
                newTab = tab.parentElement ? (<HTMLElement>tab.parentElement).lastElementChild as HTMLElement : null
                newTarget = newTarget ? newTarget.parentElement ? (<HTMLElement>newTarget.parentElement).lastElementChild as HTMLElement : null : null
                break;
            default:
                return;
        }
        if (newTab) {
            this.selected = newTab.id
            if (newTarget != null) {
                newTarget.focus()
            }
            event.preventDefault();
        }
    }
}