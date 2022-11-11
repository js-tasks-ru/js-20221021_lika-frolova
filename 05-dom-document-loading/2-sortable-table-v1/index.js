export default class SortableTable {

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig
    this.data = data
  }

  get element(){
    if (!this._element) {
      this._element = document.createElement("div")
      this._element.className = "products-list__container"
      this._element.setAttribute("data-element", "productsContainer")
      this._element.innerHTML = this.getHeader() + this.getBody()
    }

    return this._element
  }

  get subElements() {
    if (!this._subElements) {
      this._subElements = {};
      const elements = this.element.querySelectorAll('[data-element]');

      for (const subElement of elements) {
        const name = subElement.dataset.element;
        this._subElements[name] = subElement;
      }
    }
    
    return this._subElements;
  }

  destroy() {
    this.remove()
    this._body = null  
    this._header = null
    this._element - null      
  }

  remove() {
    if (this._element) {
      this.element.remove()
    }
  }

  sort(fieldValue, orderValue) {
     
    for (const headerItem of this.element.querySelectorAll('.sortable-table__cell[data-id]')) {
      if (headerItem.dataset.id === fieldValue) {
        headerItem.dataset.order = orderValue
      }
      else {
        headerItem.dataset.order = ""
      }
    }

    const sortRule = this.getSortRule(fieldValue, orderValue)
    const sortData = [...this.data].sort(sortRule)
    this.subElements.body.innerHTML = `${this.getBodyRows(sortData).join("")}`
  }

  getSortRule(fieldValue, orderValue) {
    const headerItem = this.headerConfig.find(x => x.id === fieldValue) 
    const sortType = this.getSortType(orderValue)

    if (headerItem.sortType === "string") {
      return (a, b) => sortType * a[fieldValue].localeCompare(b[fieldValue], ["ru", "eng"], {caseFirst: "upper"})
    }
    if (headerItem.sortType ===  "number") {
      return (a, b) => sortType * (a[fieldValue] - b[fieldValue])
    }
  }

  getSortType = (param) => {
    switch (param) {
        case "asc":
            return 1
        case "desc":
            return -1
        default:
            throw "Передан некорректный тип сортировки!"
    }
  }

  getBody() {
    return `<div data-element="body" class="sortable-table__body">
              ${this.getBodyRows().join("")}
            </div>`
  }

  getBodyRows(data = this.data) {
    return data.map(x => 
          `<a href="/products/${x.id}" class="sortable-table__row">
              ${this.getRowCells(x).join("")}
           </a>`)
  }

  getRowCells(item) {    
    return this.headerConfig.map(headerItem => headerItem.template ? 
                    headerItem.template(item[headerItem.id]) :
                   `<div class="sortable-table__cell">${item[headerItem.id]}</div>`)
  }

  getHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
              ${this.headerConfig.map(x => this.getHeaderCell(x)).join("")}
            </div>`
  }

  getHeaderCell(item) {
    return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
              <span>${item.title}</span>
            </div>`
  }
}