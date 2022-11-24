export default class SortableTable {
  DESC = "desc"
  ASC = "asc"

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headersConfig = headersConfig
    this.data = data
    this.sorted = {
      id: sorted.id,
      order: sorted.order
    }
  }

  get element(){
    if (!this._element) {
      this._element = document.createElement("div")
      this._element.className = "products-list__container"
      this._element.setAttribute("data-element", "productsContainer")
      this._element.innerHTML = this.getHeader() + this.getBody()

      this.sort(this.sorted.id, this.sorted.order)
      this.subElements.header.addEventListener("pointerdown", this.onClickHeader)
    }
    
    return this._element
  }

  get subElements() {
    if (!this._subElements) {
      this._subElements = {}
      const elements = this.element.querySelectorAll('[data-element]')

      for (const subElement of elements) {
        const name = subElement.dataset.element;
        this._subElements[name] = subElement;
      }
    }
    
    return this._subElements;
  }

  onClickHeader = (event) => {
    const cell = event.target.closest('[data-sortable="true"]')

    if (cell && this.element.contains(cell)) {
    
      if (this.sorted.id === cell.dataset.id) {
        this.sorted.order = this.inversionSortType
      } else {
        this.sorted.id = cell.dataset.id
        this.sorted.order = this.DESC
      }
      
      this.sort(this.sorted.id, this.sorted.order)
    }
  }

  get inversionSortType() {
    if (this.sorted.order === this.DESC) return this.ASC
    if (this.sorted.order === this.ASC) return this.DESC
  }

  sort(fieldValue, orderValue) {

    const headers = this.element.querySelectorAll('.sortable-table__cell[data-id][data-sortable="true"]')
     
    for (const headerItem of headers) {
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
    const headerItem = this.headersConfig.find(x => x.id === fieldValue) 
    const sortType = this.getSortType(orderValue)

    if (headerItem.sortType === "string") {
      return (a, b) => sortType * a[fieldValue].localeCompare(b[fieldValue], ["ru", "eng"], {caseFirst: "upper"})
    }
    if (headerItem.sortType ===  "number") {
      return (a, b) => sortType * (a[fieldValue] - b[fieldValue])
    }
    if (headerItem.sortType ===  "custom") {
      return (a, b) => sortType * headerItem.customSorting(a, b)
    }
  }

  getSortType = (param) => {
    switch (param) {
        case this.ASC:
            return 1
        case this.DESC:
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
    return this.headersConfig.map(headerItem => headerItem.template ? 
                    headerItem.template(item[headerItem.id]) :
                   `<div class="sortable-table__cell">${item[headerItem.id]}</div>`)
  }

  getHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
              ${this.headersConfig.map(x => this.getHeaderCell(x)).join("")}
            </div>`
  }

  getHeaderCell(item) {
    return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
              <span>${item.title}</span>
              ${item.sortable ? `<span data-element="arrow" class="sortable-table__sort-arrow">
                                  <span class="sort-arrow"></span>
                                </span>` : ``}
            </div>`
  }

  destroy() {
    this.remove()
    this._body = null  
    this._header = null
    this._element = null      
  }

  remove() {
    if (this._element) {
      this.element.remove()
    }
  }
}
