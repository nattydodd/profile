const _ = require('lodash');
const css = require('./about.css');

const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = css;
  return style;
}

const getTemplate = () => {
  const template = document.createElement('template');
  template.innerHTML = `
    <div class="profile-about">
      <div class="inner">
        <p class="text"></p>
        <div class="image-wrapper">
          <img id="image1" />
        </div>
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
    this.image1 = this.getAttribute('image1')
    const root = this.shadowRoot;
    root.appendChild(getStyle())
    root.appendChild(getTemplate().content.cloneNode(true))
    root.querySelector('p.text').innerText = this.text
    root.querySelector('img#image1').src = this.image1
  }

  connectedCallback() {
    document.addEventListener('scroll', _.throttle(this.handleScroll.bind(this), 500))
  }

  handleScroll() {
    const text = this.shadowRoot.querySelector('p.text')
    const image1 = this.shadowRoot.querySelector('img#image1')
    
    if (text.getBoundingClientRect().top < 0.7 * window.innerHeight) {
      text.classList.add('visible')
    } else {
      text.classList.remove('visible')
    }

    if (image1.getBoundingClientRect().top < 0.7 * window.innerHeight) {
      image1.classList.add('visible')
    } else {
      image1.classList.remove('visible')
    }
  }
}

module.exports = ProfileAbout;