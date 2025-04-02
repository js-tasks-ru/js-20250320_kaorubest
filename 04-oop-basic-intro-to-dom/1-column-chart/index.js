export default class ColumnChart {
    element;
    chartHeight = 50;
    loaderClassName = 'column-chart_loading';

    constructor({
        data = [],
        label = '',
        value = '',
        link = '',
        formatHeading = (value) => value,
     } = {}) {
        this.data = data;
        this.label = label;
        this.value = value;
        this.link = link;
        this.formatHeading = formatHeading;

        this.element = this.createElement();
    }

    createTemplate() {
        return `
        <div class="column-chart" style="--chart-height: 50">
            <div class="column-chart__title">
                Total ${this.label}
                <a href="${this.link}" class="column-chart__link">View all</a>
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
                <div data-element="body" class="column-chart__chart">
                    ${this.createDataGraph(this.data)}
                </div>
            </div>
        </div>
        `
    }

    createDataGraph(data) {
        const columnProps = this.getColumnProps(data);
        return columnProps.map(({ value, percent }) =>
            `<div style="--value: ${value}" data-tooltip="${percent}"></div>`
            ).join('');
    }

    getColumnProps(data) {
        const maxValue = Math.max(...data);
        const scale = 50 / maxValue;
      
        return data.map(item => {
          return {
            percent: (item / maxValue * 100).toFixed(0) + '%',
            value: String(Math.floor(item * scale))
          };
        });
    }

    createElement() {
        const element = document.createElement('div');
        element.innerHTML = this.createTemplate();
        element.setAttribute('class', this.data.length === 0 && this.loaderClassName);
        return element;
    }

    remove() {
        this.element = null;
    }

    destroy() {}

    update() {}
}
