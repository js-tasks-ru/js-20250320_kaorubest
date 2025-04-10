class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
    this.element = this.createElement();
  }

  initialize () {
    document.addEventListener('pointerover', this.handleShowTooltip.bind(this));
    document.addEventListener('pointerout', this.handleHideTooltip.bind(this));
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createTemplate() {
    return `
      <div class="tooltip"></div>
    `
  }

  render(text) {
    document.body.append(this.element);
    this.element.innerHTML = text;
  }

  handleShowTooltip(e) {
    const { tooltip } = e.target.dataset;
    if (!tooltip) {
      return;
    }
    this.render(tooltip);
  }

  handleHideTooltip(e) {
    const { tooltip } = e.target.dataset;
    if (!tooltip) {
      return;
    }
    this.element.innerHTML = '';
    this.remove();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointerover', this.handleShowTooltip);
    document.removeEventListener('pointerout', this.handleHideTooltip);
  }
}

export default Tooltip;
