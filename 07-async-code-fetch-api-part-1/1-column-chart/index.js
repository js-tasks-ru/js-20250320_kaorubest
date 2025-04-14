import ColumnChart from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChartV2 extends ColumnChart {
    constructor({ data, label, link, value, url = '/',
        range = {
            from: new Date(), to: new Date()    
        },
    } = {}) {
        super({ data, label, value, link });
        this.url = `${BACKEND_URL}/${url}`;

        const { from, to } = range;
        this.from = from;
        this.to = to;

        this.element = this.createElement();
        this.selectSubElements();
    }

    selectSubElements() {
        this.subElements = {};
        this.element.querySelectorAll('[data-element]').forEach(function (element) {
          this.subElements[element.dataset.element] = element;
        }.bind(this));
      }

    async update(from, to) {
        try {
            this.element.classList.add(this.loaderClassName);
            const data = await this.fetchData(from, to);
            super.update(Object.values(data));
            this.element.classList.remove(this.loaderClassName);
            return data;
        } catch (err) {
            this.element.classList.remove(this.loaderClassName);
            throw new Error(err);
        }
    }

    async fetchData(from, to) {
        try {
            const response = await fetch(
                `${this.url}?${new URLSearchParams({
                    from: from.toISOString(),
                    to: to.toISOString()
                })}`
            );
            return await response.json();
        } catch(err) {
            throw new Error(err);
        }
    }
}
