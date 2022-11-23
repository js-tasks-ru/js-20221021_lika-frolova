import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {

    constructor({
        label = '', 
        link = '', 
        formatHeading, 
        chartHeight = 50,
        url = "",
        range = {}} 
        = {}) {
        this.label = label
        this.link = link
        this.chartHeight = chartHeight
        this.url = url
        this.dateFrom = range?.from
        this.dateTo = range?.to
        this.formatHeading = formatHeading

        this.update(this.dateFrom, this.dateTo)
    }

    async update(from, to) {

        this.element.classList.add('column-chart_loading')

        let url = new URL(this.url, BACKEND_URL)
        url.searchParams.set('from', from)
        url.searchParams.set('to', to)

        this.data = await fetchJson(url)
        this.from = from
        this.to = to

        this.subElements.body.innerHTML = this.innerHtmlBody
        this.subElements.header.innerHTML = this.innerHtmlHeader

        this.element.classList.remove('column-chart_loading')

        return this.data
    }

    get element() {
        if (!this._element) {
            this._element = document.createElement("div")
            this._element.className = "column-chart column-chart_loading"
            this._element.style = `--chart-height: ${this.chartHeight}`
            this._element.innerHTML = this.innerHtmlElement
        }
        return this._element      
    } 

    get subElements() {
        if (!this._subElements) {

            this._subElements = {}
            const elements = this.element.querySelectorAll('[data-element]')
      
            for (const subElement of elements) {
                const name = subElement.dataset.element
                this._subElements[name] = subElement
            }
        }
  
        return this._subElements      
    }  

    get innerHtmlElement() {
        return `<div class="column-chart__title">
                    Total ${this.label}
                   ${this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ''}
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">
                        ${this.innerHtmlHeader}
                    </div>
                    <div data-element="body" class="column-chart__chart">
                        ${this.innerHtmlBody}
                    </div>
                 </div>`
    }

    get dataIsEmpty() {
        return !this.data ||
               !Object.values(this.data)?.length
    }

    get innerHtmlHeader() {
        
        if (this.dataIsEmpty) return ''

        const sum = Object.values(this.data).reduce((x, y) => (x + y), 0)
        return this.formatHeading ? this.formatHeading(sum) : sum
    }

    get innerHtmlBody() {

        if (this.dataIsEmpty) return ''

        const values = Object.values(this.data)

        const maxValue = Math.max(...values)
        let bodyChilds = []

        for (const item of values) {
            const columnProps = this.getColumnProps(item, maxValue)
            bodyChilds.push(`<div style="--value: ${columnProps.value}" data-tooltip="${columnProps.percent}"></div>`)
        }

        return bodyChilds.join("")
    }

    getColumnProps(item, maxValue) {
        const scale = this.chartHeight / maxValue
      
        return {
            percent: (item / maxValue * 100).toFixed(0) + '%',
            value: String(Math.floor(item * scale))
        }
    }

    remove() {
        if (this._element) {
            this.element.remove()
        }
    }

    destroy() {
        this.remove()

        this._element = null
        this._elementTitle = null
        this._elementContainer = null
        this._elementBody = null
        this._elementLink = null
        this._elementHeader = null
    }
}
