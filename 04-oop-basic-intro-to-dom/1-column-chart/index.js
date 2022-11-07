export default class ColumnChart {

    constructor({data = [], label = '', value = 0, link = '', formatHeading = data => data, chartHeight = 50} = {}) {
        this.data = data
        this.label = label
        this.value = formatHeading(value)
        this.link = link
        this.chartHeight = chartHeight
    }

    remove() {
        if (this._element) {
            this.element.remove()
        }
    }

    destroy() {
        this._element = null
        this._elementTitle = null
        this._elementContainer = null
        this._elementBody = null
        this._elementLink = null
        this._elementHeader = null
    }

    update(newData) {
        this.data = newData
        this.generateElementBodyChilds()
    }

    get element() {
        if (!this._element) {
            this._element = document.createElement("div")
            this._element.className = this.data.length ? "column-chart" : "column-chart column-chart_loading"
            this._element.style = `--chart-height: ${this.chartHeight}`

            this._element.append(this.elementTitle)
            this._element.append(this.elementContainer)
        }
        return this._element      
    } 

    get elementTitle() {
        if (!this._elementTitle) {
            this._elementTitle = document.createElement("div")
            this._elementTitle.className = "column-chart__title"
            this._elementTitle.innerHTML = `Total ${this.label}`

            if (this.link) {
                this._elementTitle.append(this.elementLink)
            }
        }        

        return this._elementTitle
    }

    get elementLink() {
        if (!this._elementLink) {
            this._elementLink = document.createElement("a")
            this._elementLink.className = "column-chart__link"
            this._elementLink.innerHTML = "View all"
            this._elementLink.setAttribute("href", this.link)
        }        

        return this._elementLink
    }

    get elementContainer() {
        if (!this._elementContainer) {
            this._elementContainer = document.createElement("div")
            this._elementContainer.className = "column-chart__container"

            this._elementContainer.append(this.elementHeader)
            this._elementContainer.append(this.elementBody)
        }

        return  this._elementContainer
    }

    get elementHeader() {
        if (!this._elementHeader) {
            this._elementHeader = document.createElement("div")
            this._elementHeader.className = "column-chart__header"
            this._elementHeader.setAttribute("data-element", "header")
            this._elementHeader.innerHTML = `${this.value}`
        }

        return this._elementHeader
    }

    get elementBody() {
        if (!this._elementBody) {
            this._elementBody = document.createElement("div")
            this._elementBody.className = "column-chart__chart"
            this._elementBody.setAttribute("data-element", "body")

            this.generateElementBodyChilds()
        }

        return this._elementBody
    }
    
    generateElementBodyChilds() {

        this.elementBody.innerHTML = ''
        const maxValue = Math.max(...this.data)

        for (const item of this.data) {
            const columnProps = this.getColumnProps(item, maxValue)

            const elementChart = document.createElement("div")
            elementChart.style = `--value: ${columnProps.value}`
            elementChart.setAttribute("data-tooltip", columnProps.percent)

            this.elementBody.append(elementChart)
        }
    }

    getColumnProps(item, maxValue) {
        const scale = this.chartHeight / maxValue;
      
        return {
            percent: (item / maxValue * 100).toFixed(0) + '%',
            value: String(Math.floor(item * scale))
        }
      }
}   