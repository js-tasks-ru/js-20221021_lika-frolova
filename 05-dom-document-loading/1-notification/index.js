let shownNotification

export default class NotificationMessage {

    constructor(message = '', {duration = 0, type = ''} = {}) {
        this.message = message
        this.duration = durationIsValid(duration) ? duration : 20
        this.type = typeIsValid(type) ? type : ''
    }

    show(parent = document.body) {
        if (shownNotification) {
            shownNotification.remove()
        }

        parent.append(this.element)
        shownNotification = this.element
        this.timerId = setTimeout(() => this.remove(), this.duration)
    }

    destroy() {
        this.remove()
        this._element = null        
    }

    remove() {
        clearTimeout(this.timerId)
        
        if (shownNotification == this.element) {
            shownNotification = null
            this.element.remove()
        }
    }

    get element() {
        if (!this._element) {
            const wrapper = document.createElement("div")
            wrapper.innerHTML = this.template
            this._element = wrapper.firstElementChild
        }

        return this._element
    }

    get template() {
        return `<div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
                    <div class="timer"></div>
                    <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                        ${this.message}
                    </div>
                    </div>
                </div>`
    }  
}

const durationIsValid = (duration) => {
    return typeof duration === "number" &&
           duration > 0
}

const typeIsValid = (type) => {
    return ["success", "error"].includes(type)
}
