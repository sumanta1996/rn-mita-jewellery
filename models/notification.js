class Notification {
    constructor(id, body, title, orderId, orderTime, read, newNot, url) {
        this.id = id;
        this.body = body;
        this.title = title;
        this.orderId = orderId;
        this.orderTime = orderTime;
        this.read = read;
        this.newNot = newNot;
        this.url = url;
    }
}

export default Notification;