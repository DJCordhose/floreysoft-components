import { LitElement, CSSResult } from "lit-element";
export declare class DemoSection extends LitElement {
    title: string;
    npm: string;
    github: string;
    minified: string;
    gzipped: string;
    static readonly styles: CSSResult[];
    render(): import("lit-element").TemplateResult;
}
export declare class Demo extends LitElement {
    static readonly styles: CSSResult[];
    render(): import("lit-element").TemplateResult;
    openDialog(id: string): void;
}
//# sourceMappingURL=Demo.d.ts.map