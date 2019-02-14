import { LitElement, TemplateResult, html, property } from 'lit-element';
import { FieldFactory, FieldDefinition } from './FieldDefinitions';
import { ValueChangedEvent } from './ValueChangedEvent';

export class Field<T extends FieldDefinition, V> extends LitElement {
  @property({ type: Object })
  definition: T

  value: V;

  render() : void | TemplateResult {
    if (typeof this.value === "undefined" && typeof this.definition.default != "undefined") {
      this.value = this.definition.default as V;
      if (this.definition.name) {
        this.dispatchEvent(new ValueChangedEvent(this.definition.name, this.value));
      }
    }
    if (this.definition.hidden) {
      return html``;
    }
    return html`${this.renderHeader()}${this.renderField()}`
  }

  protected renderStyles() : string | void {
  }

  protected renderHeader(): TemplateResult | void {
    return html`
      <style>
        ${this.renderStyles()}
        .fs-prompt {
          flex: 0 0;
          font-family: var(--lumo-font-family);            
          font-size: var(--lumo-font-size-m);
        }
        .fs-help-text {
          flex: 1 0;
          font-family: var(--lumo-font-family);            
          font-size: var(--lumo-font-size-s);
        }
        .fs-field {
          flex: 0 0;
          margin-bottom: 6px;
        }
        .hidden {
          display: none;
        }
      </style>
      ${this.definition.prompt ? html`<div class="fs-prompt">${this.definition.prompt}</div>` : html``}          
      ${this.definition.helpText ? html`<div class="fs-help-text">${this.definition.helpText}</div>` : html``}`;
  }

  protected renderField(): TemplateResult | void {
  }

  protected valueChanged(e: any) {
    this.value = e.currentTarget.value;
    if (this.definition.name) {
      this.dispatchEvent(new ValueChangedEvent(this.definition.name, this.value));
    }
  }
}

export class ComplexField<T extends FieldDefinition, V> extends Field<T, V> {
  factory: FieldFactory
}

export class CompoundField<T extends FieldDefinition, V> extends ComplexField<T, V> {
  protected renderHeader() {
  }

  protected includeOptionalField(fields: FieldDefinition[], include: boolean, type: string, name: string, helpText: string, autofill: string, colspan: number): number {
    if (include) {
      fields.push({
        type: type,
        name: name,
        helpText: helpText,
        autofill: autofill,
        colspan: colspan
      })
      return colspan;
    }
    return 0;
  }
}