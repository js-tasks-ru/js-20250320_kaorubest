import ColumnChart from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChartV2 extends ColumnChart {
    constructor({ data, label, link, value, url = '',
        range = {
            from: new Date(), to: new Date()    
        },
    } = {}) {
        super({ data, label, value, link });
        this.url = new URL(`${BACKEND_URL}/${url}`);

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
            return data;
        } catch (err) {
            throw new Error(err);
        } finally {
            this.element.classList.remove(this.loaderClassName);
        }
    }

    async fetchData(from, to) {
        try {
            this.url.searchParams.append('from', from.toISOString());
            this.url.searchParams.append('to', to.toISOString())
            const response = await fetch(this.url.toString());
            return await response.json();
        } catch(err) {
            throw new Error(err);
        } finally {
            this.url.searchParams.delete('from');
            this.url.searchParams.delete('to');
        }
    }
}
