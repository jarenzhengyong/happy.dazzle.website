class dzCartItemCode extends dzEditableComponent {
  constructor() {
    super();
  }

  static get is() {
    return 'dz-cart-item';
  }

  render() {
    return this.html`
        <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  async onCreated() {
    await this._listenDzFunction();
  }

  async _listenDzFunction() {
    let buttons = this.querySelectorAll('[dz-func]');

    buttons.forEach(item => {
      let fc = item.getAttribute('dz-func') || null;
      item.addEventListener('click', () => {
        switch (fc) {
          case '_clickItemImage':
            this._onClickItemImage();
            break;
          case '_clickRemoveFromCart':
            this._onClickRemoveFromCart();
            break;
        }
      });
    });
  }

  _onClickItemImage() {
    const itemId = this.getAttribute('id');
    location.href = `/product/${itemId}`;
  }

  async _onClickRemoveFromCart() {
    const itemId = this.getAttribute('id');
    const cartItems = window.store.get('cartItems') || {};
    if (cartItems[itemId]) {
      delete cartItems[itemId];
      window.store.set('cartItems', cartItems);
      await window.helpers.showModal(window.helpers.getDefaultConfig().messages.removeItemFromCartSuccessfully, {autoClose: true});
    }

    window.store.set('cartChanged', new Date().getTime());
  }

  replaceToken(data, html) {
    let index = this.index;
    data = reformData(data);
    // var re = new RegExp('(\[\[([0-9a-zA-Z_| ]*)\]\])');
    const regexp = /(\[\[([0-9a-zA-Z_| ]*)\]\])/g;
    const array = [...html.matchAll(regexp)];
    let arr = [];
    array.forEach(item => {
      arr.push(item[0]);
    });

    arr.forEach(item => {
      let orgItem, token, action, result;
      if (item) {
        console.log('Item', item);
        orgItem = item;
        item = item.replace('[[', '');
        item = item.replace(']]', '');
        [token, action] = item.split('|');
        if (typeof action === 'undefined')
          action = null;
        console.log('Token', token, action);
        token = token.trim();
        token = data[token];

        if (action)
          action = action.trim();

        else
          action = null;

        if (action)
          result = this.preprocess(token, action);
        else
          result = token;

        html = html.replace(orgItem, result);

      }
    });

    return html;

    function reformData(data) {
      data['_index'] = index;
      for (let k in data) {
        if (Array.isArray(data[k])) {
          let item = data[k];
          for (let i = 0; i < item.length; i++)
            data[k + i.toString()] = item[i];
        }
      }
      return data;
    }

  }
}

customElements.define(dzCartItemCode.is, dzCartItemCode);
