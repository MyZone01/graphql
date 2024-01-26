/**
 * Renvoie un élément HTML depuis une chaine
 * @param {string} str 
 * @returns {HTMLElement}
 */
function strToDom(str) {
  return document.createRange().createContextualFragment(str).firstChild;
}

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}

/**
* Représente un point
* @property {number} x
* @property {number} y
*/
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  toSvgPath() {
    return `${this.x} ${this.y}`
  }

  static fromAngle(angle) {
    return new Point(Math.cos(angle), Math.sin(angle))
  }
}

/**
* @property {number[]} data
* @property {SVGPathElement[]} paths
* @property {SVGLineElement[]} lines
* @property {HTMLDivElement[]} labels
*/
class PieChart extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })

    // On prépare les paramètres
    const donut = this.getAttribute('donut') ?? '0.005'
    const gap = this.getAttribute('gap') ?? '0.015'
    const colors = this.getAttribute('colors')?.split(';') ?? ['#FAAA32', '#3EFA7D', '#FA6A25', '#0C94FA', '#FA1F19', '#0CFAE2', '#AB6D23'];
    this.data = this.getAttribute('data').split(';').map(v => parseFloat(v))
    const labels = this.getAttribute('labels')?.split(';') ?? []

    // On génère la structure du DOM nécessaire pour la suite
    const svg = strToDom(/*html*/`<svg viewBox="-1 -1 2 2">
          <g mask="url(#graphMask)"></g>
          <mask id="graphMask">
              <rect fill="white" x="-1" y="-1" width="2" height="2"/>
              <circle r="${donut}" fill="black"/>
          </mask>
      </svg>`)

    const pathGroup = svg.querySelector('g')
    const maskGroup = svg.querySelector('mask')
    this.paths = this.data.map((_, k) => {
      const color = colors[k % (colors.length - 1)]
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('fill', color)
      pathGroup.appendChild(path)
      path.addEventListener('mouseover', () => this.handlePathHover(k))
      path.addEventListener('mouseout', () => this.handlePathOut(k))
      return path
    })
    this.lines = this.data.map(() => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('stroke', '#000')
      line.setAttribute('stroke-width', gap)
      line.setAttribute('x1', '0')
      line.setAttribute('y1', '0')
      maskGroup.appendChild(line)
      return line
    })
    this.labels = labels.map((label) => {
      const div = document.createElement('div')
      div.innerText = label
      shadow.appendChild(div)
      return div
    })
    const style = document.createElement('style');
    style.innerHTML = /*css*/`
          :host {
              display: block;
              position: relative;
          }
          svg {
              width: 100%;
              height: 100%;
          }
          path {
              cursor: pointer;
              transition: opacity .3s;
          }
          path:hover {
              opacity: 0.5;
          }
          div {
              position: absolute;
              top: 0;
              left: 0;
              padding: .1em .2em;
              transform: translate(-50%, -50%);
              background-color: var(--tooltip-bg, #FFF);
              opacity: 0;
              transition: opacity .3s;
          }
          .is-active {
              opacity: 1;
          }
      `
    shadow.appendChild(style)
    shadow.appendChild(svg)
  }

  connectedCallback() {
    const now = Date.now()
    const duration = 1000
    const draw = () => {
      const t = (Date.now() - now) / duration
      if (t < 1) {
        this.draw(easeOutExpo(t))
        window.requestAnimationFrame(draw)
      } else {
        this.draw(1)
      }
    }
    window.requestAnimationFrame(draw)
  }

  /**
   * Dessine le graphique
   * @param {number} progress 
   */
  draw(progress = 1) {
    const total = this.data.reduce((acc, v) => acc + v, 0)
    let angle = Math.PI / -2
    let start = new Point(0, -1)
    for (let k = 0; k < this.data.length; k++) {
      this.lines[k].setAttribute('x2', start.x)
      this.lines[k].setAttribute('y2', start.y)
      const ratio = (this.data[k] / total) * progress
      if (progress === 1) {
        this.positionLabel(this.labels[k], angle + ratio * Math.PI)
      }
      angle += ratio * 2 * Math.PI
      const end = Point.fromAngle(angle)
      const largeFlag = ratio > .5 ? '1' : '0'
      this.paths[k].setAttribute('d', `M 0 0 L ${start.toSvgPath()} A 1 1 0 ${largeFlag} 1 ${end.toSvgPath()} L 0 0`)
      start = end
    }
  }

  /**
   * Gère l'effet lorsque l'on survol une section du graph
   * @param {number} k Index de l'élément survolé
   */
  handlePathHover(k) {
    this.dispatchEvent(new CustomEvent('sectionhover', { detail: k }))
    this.labels[k]?.classList.add('is-active')
  }

  /**
   * Gère l'effet lorsque l'on quitte la section du graph
   * @param {number} k Index de l'élément survolé
   */
  handlePathOut(k) {
    this.labels[k]?.classList.remove('is-active')
  }

  /**
   * Positionne le label en fonction de l'angle
   * @param {HTMLDivElement|undefined} label 
   * @param {number} angle 
   */
  positionLabel(label, angle) {
    if (!label || !angle) {
      return;
    }
    const point = Point.fromAngle(angle)
    label.style.setProperty('top', `${(point.y * 0.5 + 0.5) * 100}%`)
    label.style.setProperty('left', `${(point.x * 0.5 + 0.5) * 100}%`)
  }
}

customElements.define('pie-chart', PieChart)

class BarChart extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this.data = this.getAttribute('data').split(';').map(Number);
    this.chartHeight = Math.max(...this.data);

    const colors = this.getAttribute('colors')?.split(';') || [];
    const labels = this.getAttribute('labels')?.split(';') || [];

    const container = document.createElement('div');
    container.classList.add("container");
    container.style.position = 'relative';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg = svg
    this.rects = this.data.map((height, index) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const rectWidth = 100 / this.data.length; // Adjust width based on the number of bars
      rect.setAttribute('x', index * rectWidth + '%');
      rect.setAttribute('width', rectWidth + '%');
      rect.setAttribute('y', "500");
      rect.setAttribute('height', 0);
      rect.setAttribute('fill', colors[index % colors.length] || '#3498db');

      const labelDiv = document.createElement('div');
      labelDiv.innerText = labels[index] || '';
      labelDiv.style.position = 'absolute';
      labelDiv.style.bottom = "-50px";
      labelDiv.style.left = index * rectWidth + rectWidth / 2 + '%'; // Center the label
      labelDiv.style.transform = 'translateX(-50%)';
      labelDiv.style.opacity = '0';
      labelDiv.style.transition = 'opacity 0.3s';

      container.appendChild(labelDiv);
      svg.appendChild(rect);

      // Event listeners for hover effect
      rect.addEventListener('mouseenter', () => this.handleRectHover(rect, labelDiv));
      rect.addEventListener('mouseleave', () => this.handleRectOut(rect, labelDiv));

      return { rect, labelDiv };
    });

    const style = document.createElement('style');
    style.textContent = /*css*/`
      :host {
        display: block;
      }

      .container {
          width: 100%;
          height: 100%;
      }

      svg {
        width: 100%;
        height: 100%;
      }

      .container div {
        padding: .1em .2em;
        background-color: var(--tooltip-bg, #FFF);
        z-index: 3;
      }

      rect {
        cursor: pointer;
        transition: height 0.3s, y 0.3s;
      }

      rect:hover {
        fill: #2980b9;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(container);
    container.appendChild(svg);
  }

  connectedCallback() {
    this.animateBars();
  }

  animateBars() {
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min(1, (currentTime - startTime) / duration);

      this.data.forEach((height, index) => {
        const animatedHeight = ((height / this.chartHeight) * this.svg.clientHeight) * progress;
        const translateY = this.svg.clientHeight - animatedHeight;
        this.rects[index].rect.setAttribute('y', translateY);
        this.rects[index].rect.setAttribute('height', animatedHeight > 0 ? animatedHeight : 0);
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  handleRectHover(rect, labelDiv) {
    labelDiv.style.opacity = '1';
    rect.style.fill = '#2980b9';
  }

  handleRectOut(rect, labelDiv) {
    labelDiv.style.opacity = '0';
    rect.style.fill = ''; // Reset fill to the original color
  }
}

customElements.define('bar-chart', BarChart);

class RadarChart extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // Attributes
    const scores = this.getAttribute('scores').split(';').map(Number);
    const labels = this.getAttribute('labels').split(';');
    const ids = this.getAttribute('ids')?.split(';');
    const max = parseFloat(this.getAttribute('max')) || 1.0;

    // Constants
    const width = this.getAttribute('width') ?? 100; // Adjust as needed
    const height = this.getAttribute('height') ?? 100; // Adjust as needed
    const center_x = width / 2 ?? 75; // Adjust as needed
    const center_y = height / 2 ?? 50; // Adjust as needed
    const radius = 80; // Adjust as needed
    const sides = scores.length;

    // Create SVG
    const svg = strToDom(/*html*/`<svg viewBox="0 0 100 100"></svg>`);
    shadow.appendChild(svg);

    // Generate points of the chart frame
    const points = [];
    let angle = 360;
    for (let side = 0; side < sides; side++) {
      angle -= 360 / sides;
      const rads = angle * (Math.PI / 180);
      const x = center_x + radius * Math.cos(rads);
      const y = center_y + radius * Math.sin(rads);
      points.push([x, y]);
    }

    // Regularize scores
    for (let i = 0; i < scores.length; i++) {
      scores[i] /= max;
    }

    // Draw measures of the chart
    const measureGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    for (let i = 0; i < points.length; i++) {
      const x = points[i][0];
      const y = points[i][1];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', center_x);
      line.setAttribute('y1', center_y);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', 'white');
      line.setAttribute('stroke-width', '.5');
      measureGroup.appendChild(line);
    }
    svg.appendChild(measureGroup);

    // Draw frame of the chart and set styles
    const poly = this.polygon({ stroke: '#3498db', 'stroke-width': '2', 'fill': 'white' }, points);
    svg.appendChild(poly);

    // Draw chart
    const pathString = this.pathString(center_x, center_y, points, scores);
    const chartPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    chartPath.setAttribute('d', pathString);
    chartPath.setAttribute('fill', '#FAAA32');
    // chartPath.setAttribute('fill-opacity', 'q');
    chartPath.setAttribute('stroke-width', '.5');
    chartPath.setAttribute('stroke', 'white');
    svg.appendChild(chartPath);

    // Draw labels
    for (let i = 0; i < points.length; i++) {
      const x = this.linedOn(center_x, points[i][0], 1);
      const y = this.linedOn(center_y, points[i][1], 1);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', 'black');
      text.textContent = labels[i];
      svg.appendChild(text);
    }

    // Draw interactive circles if ids are provided
    if (ids) {
      const circleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      for (let i = 0; i < points.length; i++) {
        for (let j = 1; j < 6; j++) {
          const x = this.linedOn(center_x, points[i][0], j * 0.2);
          const y = this.linedOn(center_y, points[i][1], j * 0.2);
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', x);
          circle.setAttribute('cy', y);
          circle.setAttribute('r', '1');
          circle.setAttribute('fill', '#888');
          circle.setAttribute('stroke-width', '0');
          circle.dataset.axis = i;
          circle.dataset.score = j / 5.0;
          circle.dataset.relatedId = ids[i];
          circle.addEventListener('mousedown', () => this.handleCircleMouseDown(circle, scores, chartPath, max));
          circle.addEventListener('mouseover', () => this.handleCircleMouseOver(circle));
          circle.addEventListener('mouseout', () => this.handleCircleMouseOut(circle));
          circleGroup.appendChild(circle);
        }
      }
      const style = document.createElement('style');
      style.textContent = /*css*/`
      :host {
        display: block;
      }
      svg {
        width: 100%;
        height: 100%;
      }

      svg text{
        text-anchor: middle;
        dominant-baseline: middle;
      }
    `;

      shadow.appendChild(style);
      svg.appendChild(circleGroup);
    }
  }

  pathString(cx, cy, points, score) {
    const vertex = [];
    for (let i = 0; i < points.length; i++) {
      const x = this.linedOn(cx, points[i][0], score[i]);
      const y = this.linedOn(cy, points[i][1], score[i]);
      vertex.push(`${x} ${y}`);
    }
    return `M ${vertex.join('L ')}L ${vertex[0]}`;
  }

  linedOn(origin, base, bias) {
    return origin + (base - origin) * bias;
  }

  polygon(params, points) {
    let pathString = points.reduce((path, [x, y], i) => {
      const s = i === 0 ? `M ${x} ${y} ` : `L ${x} ${y} `;
      return path + s;
    }, '');
    pathString += `L ${points[0]} ${points[0]}`;
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    poly.setAttribute('d', pathString);
    for (const key in params) {
      poly.setAttribute(key, params[key]);
    }
    return poly;
  }

  handleCircleMouseDown(circle, scores, chartPath, max) {
    scores[circle.dataset.axis] = circle.dataset.score;
    chartPath.setAttribute('d', this.pathString(100, 100, this.points, scores.map(score => score * max)));
  }

  handleCircleMouseOver(circle) {
    circle.setAttribute('r', '5');
  }

  handleCircleMouseOut(circle) {
    circle.setAttribute('r', '1');
  }
}

customElements.define('radar-chart', RadarChart);
