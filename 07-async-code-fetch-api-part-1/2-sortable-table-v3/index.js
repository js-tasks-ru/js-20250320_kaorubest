import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";
import Notification from "../../05-dom-document-loading/1-notification/index.js";
import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru";
const ITEMS_PER_PAGE = 30;

export default class SortableTableV3 extends SortableTableV2 {
  isLoading = false;
  start = 0;

  constructor(
    headersConfig,
    {
      data = [],
      isSortLocally = false,
      sorted = {
        id: headersConfig.find((item) => item.sortable).id,
        order: "asc",
      },
      url = "",
    } = {},
  ) {
    super(headersConfig, { data, isSortLocally });

    this.sorted = sorted;
    this.url = url;

    this.render(sorted.id, sorted.order);
  }

  async render() {
    // добавляем лоадер
    this.element.classList.add("sortable-table_loading");
    // загружаем данные
    await this.loadData();
    // удаляем лоадер
    this.element.classList.remove("sortable-table_loading");
    
    // обновляем таблицу
    this.subElements.body.innerHTML = this.createTableBodyTemplate();
    // если данных нет
    if (this.data.length === 0) {
      const notification = new Notification(
        "По заданному критерию запроса данные отсутствуют",
      );
      notification.show();
      notification.destroy();
    }
  }

  createListeners() {
    this.handleWindowScroll = this.handleWindowScroll.bind(this);
    super.createListeners();
    window.addEventListener('scroll', this.handleWindowScroll);
  }

  destroyListeners() {
    super.destroyListeners();
    window.removeEventListener('scroll', this.handleWindowScroll);
  }

  async handleWindowScroll() {
    const height = document.body.offsetHeight;
    const screenHeight = window.innerHeight;
    const scrolled = window.scrollY;
    const threshold = height - screenHeight / 4;
    const position = scrolled + screenHeight;
    const shouldProcessScroll = position >= threshold;

    if (!shouldProcessScroll) {
      return;
    }

    if (this.isLoading) {
      return;
    }

    // увеличиваем позицию данных
    this.start += ITEMS_PER_PAGE;

    await this.render();
  }

  async loadData() {
    if (this.isLoading) {
      return;
    }
    
    try {
      const url = new URL(this.url, BACKEND_URL);
      url.searchParams.append("_sort", this.sorted.id);
      url.searchParams.append("_order", this.sorted.order);
      url.searchParams.append("_start", this.start);
      url.searchParams.append("_end", this.start + ITEMS_PER_PAGE);

      this.isLoading = true;

      this.data.push(...await fetchJson(url));
    } catch (err) {
      const notification = new Notification(
        err.toString(),
      );
      notification.show();
      notification.destroy();
    } finally {
      this.isLoading = false;
    }
  }

  sort(field, order) {
    if (this.sorted.id !== field || this.sorted.order !== order) {
      this.start = 0;
      this.data = [];
    }
    this.sorted.id = field;
    this.sorted.order = order;
    super.sort(field, order);
  }

  sortOnServer() {
    this.render();
  }
}