import { LitElement, TemplateResult, customElement, property, html, query, queryAll, css, CSSResult } from "lit-element";

@customElement("fs-demo")
export class Demo extends LitElement {
    render() {
        return html`<h1>Tabs</h1>
        <fs-tabs>
            <fs-tab label="First">
                <p>Content in first tab...</p>
            </fs-tab>
            <fs-tab label="Second" selected>
                <p>Content in second tab</p>
            </fs-tab>
            <fs-tab label="Third" closeable>
                <p>Content in third tab</p>
            </fs-tab>
        </fs-tabs>`
    }
}