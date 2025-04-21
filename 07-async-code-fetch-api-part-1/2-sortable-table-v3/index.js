import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';
import Notification from '../../05-dom-document-loading/1-notification/index.js';
import fetchJson from './utils/fetch-json.js';
import throttle from './utils/throttle.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
const ITEMS_PER_PAGE = 30;

export default class SortableTableV3 extends SortableTableV2 {
  constructor(headersConfig, {
    data = [],
    isSortLocally = false,
    sorted = { id: headersConfig.find(item => item.sortable).id, order: 'asc' },
    url = ''
  } = {}) {
    super(headersConfig, { data, isSortLocally });

    // Сохраняем некоторые настройки конфига
    this.sorted = sorted;
    this.url = new URL(url, BACKEND_URL);
    this.id = this.sorted.id;
    this.order = this.sorted.order;

    // Устанавливаем флаги и начальное значение для загрузки данных
    this.isLoading = false;
    this.shouldLoad = true;
    this.start = 0;

    // Добавляем бесконечный скролл только если данные загружаются с сервера
    if (!this.isSortLocally) this.addScrollListeners();
  }

  addScrollListeners() {
    function checkPosition() {
      const height = document.body.offsetHeight
      const screenHeight = window.innerHeight
    
      const scrolled = window.scrollY
    
      const threshold = height - screenHeight / 4
    
      const position = scrolled + screenHeight
    
      if (position >= threshold) {
        this.loadData(this.id, this.order);
      }
    }

    window.addEventListener('scroll',  throttle(checkPosition.bind(this), 250));
  }

  async loadData(id, order) {
    if (this.isLoading) return;

    this.isLoading = true;

    if (!this.shouldLoad) return [];
    // Добавляем лоадер и GET параметры
    this.#appendSortParams(id, order);
    this.element.classList.add('sortable-table_loading');

    // fetch данных
    const data = await fetchJson(this.url);

    // Удаляем флаг текущей загрузки
    this.isLoading = false;
    // Удаляем лоадер и GET параметры
    this.element.classList.remove('sortable-table_loading');
    this.#removeSortParams();

    // Если получили пустой массив, значит достигли конца и больше не подгружаем
    if (data.length === 0) {
      this.shouldLoad = false;
      const notification = new Notification('По заданному критерию запроса данные отсутствуют', {
        duration: 2000,
        type: 'error'
      });
      notification.show();
      return
    }
    // Рендерим полученные данные
    this.data.push(...data);
    this.render();

    // Переходим к следующей странице
    this.start += ITEMS_PER_PAGE;
  }

  render() {
    this.subElements.body.innerHTML = this.createTableBodyTemplate();
  }

  sortOnServer (id, order) {
    this.id = id;
    this.order = order;
    this.loadData(id, order)
  }

  #appendSortParams(id, order) {
    const start = this.start;
    this.url.searchParams.append('_sort', id);
    this.url.searchParams.append('_order', order);
    this.url.searchParams.append('_start', start);
    this.url.searchParams.append('_end', start + ITEMS_PER_PAGE);
  }

  #removeSortParams() {
    this.url.searchParams.delete('_sort');
    this.url.searchParams.delete('_order');
    this.url.searchParams.delete('_start');
    this.url.searchParams.delete('_end')
  }
}
