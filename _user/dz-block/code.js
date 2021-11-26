class dzBlockCode extends dzEditableComponent {
  static getName() {
    return 'dz-block';
  }

  static get properties() {
    return {
    };
  }
  constructor(){
    super();
   
  }
  async onCreated(){
    //let html = this._template['_header'];
    let footer = this._template['_footer'] || '';
    console.log('HTML',html);
    try{
      //document.querySelector('header').innerHTML = html;
      document.querySelector('footer').innerHTML = footer;
      
      document.querySelectorAll('[dz-master]').forEach(item=>{
          let id = item.getAttribute('dz-master') || null;
          if (id)
            item.innerHTML = this._template[id];
      });
    } catch(e){
      
    }


  }

  render() {
    return this.html`
      <slot></slot>
    `;
  }
}

customElements.define(dzBlockCode.getName(), dzBlockCode);
