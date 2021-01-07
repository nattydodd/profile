(() => {

  const getStyle = () => {
    const style = document.createElement('style');
    style.textContent = "@import './about.css';";
    return style;
  }

  const getTemplate = () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="profile-about">
        <div class="inner">
          <p></p>
        </div>
      </div>
    `
    return template;
  }
  
  class ProfileAbout extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' })
      this.text = this.getAttribute('text')
      const root = this.shadowRoot;
      root.appendChild(getStyle())
      root.appendChild(getTemplate().content.cloneNode(true))
      root.querySelector('p').innerText = this.text
    }
  }

  window.customElements.define('profile-about', ProfileAbout);
})()