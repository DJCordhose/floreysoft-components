import { html, fixture, expect } from '@open-wc/testing';

import '../src/StringField';


describe('<formsey-string>', () => {
  it('native input should have type="text"', async () => {
    const definition = {

    }
    const el: any = await fixture(`<formsey-string definition="${
      definition
    }"></formsey-string>`);
    const native = el.shadowRoot.querySelector('input');
    expect(native.getAttribute('type')).to.be.eql('text');
  });


  it('properly initializes value in native widget', async () => {
    const value = 'hiho';
    const definition = {

    }
    const el: any = await fixture(`<formsey-string value="${value}" definition="${
      definition
    }"></formsey-string>`);
    expect(el).not.to.be.undefined;
    const native = el.shadowRoot.querySelector('input');
    expect(native).not.to.be.undefined;
    expect(native.value).to.be.eql(value);

  });
});
