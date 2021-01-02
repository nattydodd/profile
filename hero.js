const template = document.createElement('template');
const style = document.createElement('style');
style.textContent = "@import './hero.css';";
template.innerHTML = `
  <div class="profile-hero">
    <div class="inner">
      <canvas id="canvas"></canvas>
      <div class="background-name">
      </div>
      <h1></h1>
      <h2></h2>
    </div>
  </div>
`

class ProfileHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
    const root = this.shadowRoot;
    root.appendChild(style)
    root.appendChild(template.content.cloneNode(true))
    this.name = this.getAttribute('name')
    this.title = this.getAttribute('title')
    root.querySelector('h1').innerText = this.name
    root.querySelector('h2').innerText = this.title
    let backgroundName = this.name.split(' ')
    backgroundName = backgroundName[0].concat(backgroundName[1]).split('')
    backgroundName.forEach(letter => {
      const wrapper = root.querySelectorAll('.background-name')[0]
      const letterEl = document.createElement('div')
      letterEl.classList.add('background-name__letter')
      letterEl.innerText = letter.toUpperCase();
      wrapper.appendChild(letterEl) 
    })
  }

  connectedCallback() {
    document.addEventListener('DOMContentLoaded', () => {
      let canvas = this.shadowRoot.getElementById('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.drawLines()
    })
  }

  drawLines() {
    this.animateLine('#56CCF2', [{ x: 0, y: 200 }, { x: 100, y: 100 }])
    this.animateLine('#EB5757', [{ x: 0, y: 300 }, { x: 100, y: 200 }], 1000)
    this.animateLine('#F2AF02', [{ x: 0, y: 400 }, { x: 100, y: 300 }])
    this.animateLine('#F2AF02', [{ x: 250, y: 0 }, { x: 100, y: 150 }], 500)
    this.animateLine('#56CCF2', [{ x: 375, y: 0 }, { x: 250, y: 150 }])
    this.animateLine('#EB5757', [{ x: 375, y: 100 }, { x: 250, y: 250 }], 1500)
  }

  calcPath(vertices) {
    var path = [];
    for (var i = 1; i < vertices.length; i++) {
        var pt0 = vertices[i - 1];
        var pt1 = vertices[i];
        var dx = pt1.x - pt0.x;
        var dy = pt1.y - pt0.y;
        for (var j = 0; j < 100; j++) {
          path.push({
              x: pt0.x + dx * j / 100,
              y: pt0.y + dy * j / 100
          });
        }
    }
    return path;
  }

  animateLine(color, vertices, delay = 0) {
    let t = 1;
    const animate = (points, color) => {
      const canvas = this.shadowRoot.getElementById('canvas');
      let ctx = canvas.getContext('2d')
      if (t < points.length - 1) {
        const callback = (timestamp) => animate(points, color)
        requestAnimationFrame(callback);
      }
      // draw a line segment from the last waypoint
      // to the current waypoint
      if (points[t]) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(points[t - 1].x, points[t - 1].y);
        ctx.lineTo(points[t].x, points[t].y);
        ctx.stroke();
        t += 1;
      }
    }

    const points = this.calcPath(vertices)

    if (delay) {
      setTimeout(() => animate(points, color), delay)
    } else {
      animate(points, color);
    }
  }
}

window.customElements.define('profile-hero', ProfileHero);