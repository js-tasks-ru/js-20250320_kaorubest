import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';
import Notification from '../../05-dom-document-loading/1-notification/index.js';
import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTableV3 extends SortableTableV2 {
  constructor(headersConfig, {
    data = [],
    isSortLocally = false,
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    url = ''
  } = {}) {
    super(headersConfig, { data, isSortLocally });

    this.sorted = sorted;
    this.url = new URL(url, BACKEND_URL);
  }

  async loadData() {
    return this.sortOnServer(this.sorted.id, this.sorted.order);
  }

  async sort(field, order) {
    if (this.isSortLocally) {
      this.sortOnClient(field, order)
    } else {
      await this.sortOnServer(field, order);
    }
  }

  render() {
    this.subElements.body.innerHTML = this.createTableBodyTemplate();
  }

  async sortOnServer (id, order) {
    try {
      this.url.searchParams.append('_sort', id);
      this.url.searchParams.append('_order', order);
      this.url.searchParams.append('_start', 0);
      this.url.searchParams.append('_end', 30);
      this.element.classList.add('sortable-table_loading');
      this.data = await fetchJson(this.url);
      if (this.data.length === 0) {
        const notification = new Notification('По заданному критерию запроса данные отсутствуют')
        notification.show();
      }
      this.render();
      return this.data;
    } catch (err) {
      throw new Error(err);
    } finally {
      this.element.classList.remove('sortable-table_loading');
      this.url.searchParams.delete('_sort');
      this.url.searchParams.delete('_order');
      this.url.searchParams.delete('_start');
      this.url.searchParams.delete('_end')
    }
  }
}
