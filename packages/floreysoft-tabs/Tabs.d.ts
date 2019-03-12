import { LitElement, TemplateResult, CSSResult } from "lit-element";
export declare class Tab extends LitElement {
    id: string;
    label: string;
    selected: boolean;
    closeable: boolean;
    static readonly styles: CSSResult[];
    render(): TemplateResult;
}
export declare class Tabs extends LitElement {
    selected: string;
    readonly tabs: Tab[];
    private _slot;
    private _selected;
    private readonly KEYCODE;
    static readonly styles: CSSResult[];
    render(): TemplateResult;
    getTab(id: string): Tab | undefined;
    firstUpdated(): void;
    close(e: Event, tab: Tab): void;
    hasTab(id: string): boolean;
    private slotChanged;
    private keyDown;
}
//# sourceMappingURL=Tabs.d.ts.map