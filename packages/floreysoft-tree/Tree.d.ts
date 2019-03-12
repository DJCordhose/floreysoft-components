import { LitElement, TemplateResult, CSSResult } from 'lit-element';
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';
export interface TreeNodeManager {
    render(node: TreeNode): TemplateResult;
    do(action: string, tree: Tree, context?: any): Promise<TreeNode>;
}
export declare class TreeNode {
    id?: string;
    label: string;
    open?: boolean;
    nodes?: TreeNode[];
    hasNodes?: boolean;
    hasMore?: boolean;
    actions?: string[];
    detail?: any;
}
export declare class Tree extends LitElement {
    open: boolean;
    nodeManager: TreeNodeManager;
    styles: string;
    node: TreeNode;
    hasNodes: boolean;
    header: string;
    level: number;
    indent: number;
    actions: string[] | undefined;
    private _section;
    private _header;
    private _slot;
    private _contextMenu;
    private _loaders;
    private _nestedTrees;
    private _open;
    private _maxHeight;
    private readonly KEYCODE;
    constructor();
    static readonly styles: CSSResult[];
    render(): TemplateResult;
    firstUpdated(): void;
    updated(): void;
    obverve(observer: IntersectionObserver, loader: HTMLElement): void;
    selected(e: Event): void;
    focus(): void;
    resize(): void;
    adjustMaxHeight(event: CustomEvent): void;
    do(action: string): Promise<void>;
    protected contextMenu(e: Event): void;
    protected slotChanged(): Promise<void>;
    protected keyDown(event: KeyboardEvent): void;
    private onLoaderVisible;
}
//# sourceMappingURL=Tree.d.ts.map