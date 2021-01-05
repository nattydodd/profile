const template = document.createElement('template');
const style = document.createElement('style');
style.textContent = "@import './hero.css';";
template.innerHTML = `
  <div class="profile-hero">
    <div class="inner">
      <canvas id="canvas"></canvas>
      <div class="background-name" id="canvas-ref">
      </div>
      <div class="foreground-name">
        <h1></h1>
        <h2></h2>
      <div>
    </div>
  </div>
`

class ProfileHero extends HTMLElement {
  constructor() {
    super();
    this.lines = [];
    this.attachShadow({ mode: 'open' })
    const root = this.shadowRoot;
    root.appendChild(style)
    root.appendChild(template.content.cloneNode(true))
    this.name = this.getAttribute('name')
    this.title = this.getAttribute('title')
    root.querySelector('h1').innerText = this.name
    root.querySelector('h2').innerText = this.title
    let backgroundName = this.name.split('')
    backgroundName.forEach(letter => {
      const wrapper = root.querySelectorAll('.background-name')[0]
      const letterEl = document.createElement('div')
      letterEl.classList.add('background-name__letter')
      letterEl.innerText = letter.toUpperCase();
      wrapper.appendChild(letterEl)
      letterEl.addEventListener('mouseover', (e) => { 
        letterEl.classList.add('skew')
       }) 
      letterEl.addEventListener('mouseout', (e) => { 
        setTimeout(() => { letterEl.classList.remove('skew') }, 1000)
       }) 
    })
  }

  connectedCallback() {
    document.addEventListener('DOMContentLoaded', () => {
      let canvas = this.shadowRoot.getElementById('canvas');
      let ctx = canvas.getContext('2d')
      const backgroundArea = this.shadowRoot.getElementById('canvas-ref');
      canvas.width = backgroundArea.getBoundingClientRect().width;
      canvas.height = backgroundArea.getBoundingClientRect().height;
      this.drawLines()
      backgroundArea.addEventListener('mousemove', (e) => {
        this.lines.forEach(line => {
          let path = new Path2D();
          path.moveTo(line.start.x, line.start.y);
          path.lineTo(line.end.x, line.end.y);
          ctx.strokeStyle = 'transparent'
          ctx.stroke(path);
          // TODO: clientX and clientY only works on mobile
          if (ctx.isPointInStroke(path, e.clientX, e.clientY)) {
            let path2 = new Path2D();
            ctx.strokeStyle = 'red'
            ctx.beginPath();
            path2.bezierCurveTo(line.end.x, line.end.y, line.end.x / 2, line.end.y / 2, line.start.x, line.start.y)
            ctx.stroke(path2);
          }
        })
      });
    })
  }

  drawLines() {
    let canvas = this.shadowRoot.getElementById('canvas');
    const canvasWidth = canvas.getBoundingClientRect().width;
    const canvasHeight = canvas.getBoundingClientRect().height;
    const blue = '#56CCF2';
    const red = '#EB5757';
    const yellow = '#F2AF02';

    this.animateLine(blue, [{ x: 0, y: 0.30 * canvasHeight }, { x: 0.27 * canvasWidth, y: 0.15 * canvasHeight }])
    this.animateLine(red, [{ x: 0, y: 0.45 * canvasHeight }, { x: 0.27 * canvasWidth, y: 0.30 * canvasHeight }], 500)
    this.animateLine(yellow, [{ x: 0, y: 0.60 * canvasHeight }, { x: 0.27 * canvasWidth, y: 0.45 * canvasHeight }])

    this.animateLine(yellow, [{ x: 0.67 * canvasWidth, y: 0 }, { x: 0.27 * canvasWidth, y: 0.23 * canvasHeight }], 250)
    this.animateLine(blue, [{ x: canvasWidth, y: 0 }, { x: 0.67 * canvasWidth, y: 0.23 * canvasHeight }])
    this.animateLine(red, [{ x: 1.26 * canvasWidth, y: 0 }, { x: 0.67 * canvasWidth, y: 0.38 * canvasHeight }], 500)

    this.animateLine(blue, [{ x: 0.8 * canvasWidth, y: canvasHeight }, { x: 0.57 * canvasWidth, y: 0.65 * canvasHeight }], 150)
    this.animateLine(red, [{ x: 0.6 * canvasWidth, y: canvasHeight }, { x: 0.50 * canvasWidth, y: 0.85 * canvasHeight }], 250)
    this.animateLine(yellow, [{ x: canvasWidth, y: canvasHeight }, { x: 0.82 * canvasWidth, y: 0.75 * canvasHeight }], 200)
  }

  calcPath(vertices) {
    var path = [];
    for (var i = 1; i < vertices.length; i++) {
        var pt0 = vertices[i - 1];
        var pt1 = vertices[i];
        var dx = pt1.x - pt0.x;
        var dy = pt1.y - pt0.y;
        for (var j = 0; j < 50; j++) {
          path.push({
            x: pt0.x + dx * j / 50,
            y: pt0.y + dy * j / 50
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
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(points[t - 1].x, points[t - 1].y);
        ctx.lineTo(points[t].x, points[t].y);
        // TODO: use sine wave
        // ctx.bezierCurveTo(60, 37, 70, 25, points[t].x, points[t].y);
        ctx.stroke();
        t += 1;
      }
    }

    const points = this.calcPath(vertices)
    this.lines.push({ 
      start: vertices[0], 
      end: vertices[1]
    })

    if (delay) {
      setTimeout(() => animate(points, color), delay)
    } else {
      animate(points, color);
    }
  }
}

window.customElements.define('profile-hero', ProfileHero);