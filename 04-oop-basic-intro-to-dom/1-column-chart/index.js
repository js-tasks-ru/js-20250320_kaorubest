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
                ${this.createLinkTemplate()}
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
                <div data-element="body" class="column-chart__chart">
                    ${this.createChartTemplate(this.data)}
                </div>
            </div>
        </div>
        `
    }

    createLinkTemplate() {
        if (this.link) {
            return `<a href="${this.link}" class="column-chart__link">View all</a>`
        }
        return '';
    }

    createChartTemplate(data) {
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

        const { firstElementChild } = element;
        firstElementChild.classList.add(this.loaderClassName);
        return firstElementChild;
    }

    update(newData) {
        this.data = newData;
        this.element.querySelector('[data-element="body"]').innerHTML = this.createChartTemplate(this.data);}

    destroy() {
        this.remove();
    }

    remove() {
        this.element.remove();
    }
}
