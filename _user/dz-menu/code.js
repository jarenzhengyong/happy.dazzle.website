class dzMenuCode extends dzEditableComponent {
  static getName() {
    return 'dz-menu';
  }

  async _initWebEditor() {
    this.label = 'Menu';
  }

  static get properties() {
    return {
    };
  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzMenuCode.getName(), dzMenuCode);
