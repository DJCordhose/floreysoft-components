import { PropertyValues, LitElement, CSSResult } from 'lit-element';
import "./webpack-resolver";
import "ace-builds/src-min-noconflict/mode-javascript";
export declare class Ace extends LitElement {
    value: string;
    mode: string;
    theme: string;
    width: Number;
    height: Number;
    gutter: boolean;
    private div;
    private editor;
    private silent;
    static readonly styles: CSSResult[];
    protected render(): import("lit-element").TemplateResult;
    firstUpdated(): void;
    updated(changedProperties: PropertyValues): void;
    resize(): void;
    protected valueChanged(): void;
    protected updateOptions(): void;
}
//# sourceMappingURL=Ace.d.ts.map