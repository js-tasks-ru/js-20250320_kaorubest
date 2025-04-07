export default class SortableTable {
  constructor(config = [], data = []) {
      this.config = config;
      this.data = data;
      this.element = this.createElement();
      this.subElements = {};
      this.selectSubElements();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(function (element) {
      this.subElements[element.dataset.element] = element;
    }.bind(this));
  }

  createTableHeaderTemplate() {
      return this.config.map(columnConfig => (
          `<div class="sortable-table__cell" data-id="${columnConfig['id']}" data-sortable="${columnConfig['sortable']}">
              <span>${columnConfig['title']}</span>
          </div>`
      )).join('');
  }

  createTableBodyCellTemplate(product, columnConfig) {
      if (columnConfig.template) {
          return columnConfig.template(product);
      }
      const fieldId = columnConfig['id'];
      return `<div class="sortable-table__cell">${product[fieldId]}</div>`;
  }

  createTableBodyRowTemplate(product) {
      return `
          <a href="${product.link}" class="sortable-table__row">
              ${this.config.map(columnConfig =>
                  this.createTableBodyCellTemplate(product, columnConfig)
              ).join('')}
          </a>
      `
  }
  
  createTableBodyTemplate() {
      return this.data.map(product => (
          this.createTableBodyRowTemplate(product)
      )).join('');
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();

    const { firstElementChild } = element;
    return firstElementChild;
  }

  createTemplate() {
      return `
          <div class="sortable-table">
              <div data-element="header" class="sortable-table__header sortable-table__row">
                  ${this.createTableHeaderTemplate()}
              </div>
              <div data-element="body" class="sortable-table__body">
                  ${this.createTableBodyTemplate()}
              </div>
              <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
              <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                  <div>
                      <p>No products satisfies your filter criteria</p>
                      <button type="button" class="button-primary-outline">Reset all filters</button>
                  </div>
              </div>
          </div>
      `;
  }

  sort(field, order) {
    const sortMultiplier = order === 'desc' ? -1 : 1;
    const sortType = this.config.find(columnConfig => columnConfig.id === field).sortType;

    const sortFn = sortType === 'number' ?
      this.sortNumFn(field, sortMultiplier) : 
      this.sortStrFn(field, sortMultiplier)

      this.data = this.data.sort(sortFn);

    this.element.querySelector('[data-element="body"]').innerHTML = this.createTableBodyTemplate();
  }

  sortStrFn(field, sortMultiplier) {
    return (a, b) => sortMultiplier * a[field].localeCompare(b[field], ['ru', 'en'], { caseFirst: 'upper' });
  }

  sortNumFn(field, sortMultiplier) {
    return (a, b) => sortMultiplier * (a[field] - b[field]);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
