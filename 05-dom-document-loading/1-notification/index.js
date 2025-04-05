export default class NotificationMessage {
    static lastShownComponent;
    static DEFAULT_TIMEOUT = 1_000;

    constructor(
        message, {
            duration = NotificationMessage.DEFAULT_TIMEOUT,
            type = 'success'
        } = {}) {
        this.message = message;
        this.duration = duration;
        this.type = type;
        this.element = this.createElement();
    }

    show(outerElement = document.body) {
        if (NotificationMessage.lastShownComponent) {
            NotificationMessage.lastShownComponent.hide();
        }
        outerElement.append(this.element);
        NotificationMessage.lastShownComponent = this;

        this.timerId = setTimeout(() => {
            this.hide();
        }, this.duration);
    }

    hide() {
        this.remove();
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        clearTimeout(this.timerId);
        this.remove();
    }

    createElement() {
        const element = document.createElement('div');
        element.innerHTML = this.createTemplate();
        element.querySelector('.notification-body').innerHTML = this.message;
        element.querySelector('.notification-header').innerHTML = this.type;

        const { firstElementChild } = element;
        firstElementChild.classList.add(this.type);
        return firstElementChild;
    }

    createTemplate(){
        return `
            <div class="notification" style="--value:20s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                <div class="notification-header"></div>
                <div class="notification-body"></div>
                </div>
            </div>
        `
    }
}
