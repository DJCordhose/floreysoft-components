import { html, property, query, customElement, PropertyValues, LitElement, CSSResult, css } from 'lit-element';
import ace from 'ace-builds/src-min-noconflict/ace.js'
import "./webpack-resolver";
import "ace-builds/src-min-noconflict/mode-javascript";

@customElement("floreysoft-ace")
export class Ace extends LitElement {
  @property({ type: String })
  set value(value: string) {
    if (this.editor && value !== this.text ) {
      this.silent = true
      this.editor.setValue(value, -1)
      this.text = value;
      this.silent = false
    }
  }

  @property()
  mode : string = "javascript"

  @property()
  theme : string = "tomorrow_night"

  @property({ type: Number })
  width: Number;

  @property({ type: Number })
  height: Number;

  @property({ type: Boolean })
  gutter : boolean = false

  @query("#editor")
  private div: HTMLElement

  private editor: ace
  private silent: boolean = false
  private text : string

  static get styles() : CSSResult[] {
    return [css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    #editor {
      height: 100%;
    }`]
  }

  protected render() {
    return html`<div id="editor"></div>`;
  }

  firstUpdated() {
    this.editor = ace.edit(this.div)
    this.editor.renderer.attachToShadowRoot()
    if (this.value) {
      this.editor.setValue(this.value)
      this.editor.clearSelection()
    }
    this.editor.getSession().on('change', (event: any) => this.valueChanged())
  }

  updated(changedProperties : PropertyValues) {
    this.updateOptions()
  }

  resize() {
    if (this.editor) {
      this.editor.resize()
    }
  }

  protected valueChanged() {
    if ( !this.silent ) {
      this.text = this.editor.getValue();
      this.dispatchEvent(new CustomEvent('changed', { detail: { value : this.text }} ))
    }
  }

  protected updateOptions() {
    if (this.editor) {
        this.editor.renderer.setShowGutter(this.gutter)
        this.editor.setTheme("ace/theme/"+this.theme)
        this.editor.session.setMode("ace/mode/"+this.mode)
    }
  }
}