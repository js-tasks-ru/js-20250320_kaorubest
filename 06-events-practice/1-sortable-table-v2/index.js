import SortableTable from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTableV2 extends SortableTable {
  constructor(headersConfig, {
    data = [],
    isSortLocally = true
  }) {
    super(headersConfig, data);
    this.isSortLocally = isSortLocally;

    this.createArrowElement();
    this.setDefaultSorting();
    this.createListeners();
  }

  createArrowElement() {
    this.arrowElement = this.createElement(this.createArrowTemplate());
  }

  setDefaultSorting() {
    this.subElements.header
      .querySelector('.sortable-table__cell[data-id="title"]')
      .append(this.arrowElement);
  }

  createArrowTemplate() {
    return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
  }

  handleHeaderCellClick = (e) => {
    const cellElement = e.target.closest('.sortable-table__cell');

    if (!cellElement) {
      return;
    }

    const sortable = cellElement.dataset.sortable;

    if (!sortable) {
      return;
    }

    const field = cellElement.dataset.id;
    const order = this.toggleSortOrder(cellElement.dataset.order);
    cellElement.dataset.order = order;

    cellElement.append(this.arrowElement);

    this.sort(field, order);
  }

  toggleSortOrder(order) {
    switch (order) {
      case 'asc':
        return 'desc'
      case 'desc':
        return 'asc'
      default:
        return 'desc'
    }
  }

  sortOnClient(field, order) {
    super.sort(field, order);
  }

  sortOnServer(field, order) {
  }

  sort(field, order) {
    if (this.isSortLocally) {
      this.sortOnClient(field, order);
    } else {
      this.sortOnServer(field, order);
    }
  }

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderCellClick);
  }
  
  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
