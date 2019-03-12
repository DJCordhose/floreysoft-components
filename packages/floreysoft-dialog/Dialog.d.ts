import { LitElement } from "lit-element";
export declare class DialogButton {
    label: string;
    id: string;
    theme?: string;
}
export declare class Dialog extends LitElement {
    buttons: any[];
    open: boolean;
    header: string;
    theme: string;
    context: any;
    _dialog: HTMLDialogElement;
    _dialogWrapper: HTMLDialogElement;
    private x;
    private y;
    private dragging;
    constructor();
    render(): import("lit-element").TemplateResult;
    optionSelected(option: string, context: any): void;
    protected startDrag(e: MouseEvent): void;
    protected endDrag(e: MouseEvent): void;
    protected drag(e: MouseEvent): void;
}
//# sourceMappingURL=Dialog.d.ts.map