import { defineCE, fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';

import { StringField } from '../src/StringField';

describe('string field', () => {
  const CEStringField = defineCE(StringField);

  let field;
  let native;

  beforeEach(async () => {
    field = await fixture(`<${CEStringField}></${CEStringField}>`);
    native = field.shadowRoot.querySelector('input');
  });

  it('native input should have type="input"', () => {
    expect(native.getAttribute('type')).to.be.eql('input');
  });
});
