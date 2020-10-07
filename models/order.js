class Order {
    constructor (id, address, customerName, date, delivered, email, mobileNumber, totalPrice, images) {
        this.id = id;
        this.address = address;
        this.customerName = customerName;
        this.date = date;
        this.delivered = delivered;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.totalPrice = totalPrice;
        this.images = images;
    }
}

export default Order;