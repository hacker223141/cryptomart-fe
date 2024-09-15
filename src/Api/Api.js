export class Api {
    #url = 'http:/localhost:8800'
    constructor(url) {
        this.#url = url;
    }
    async getProducts() {
        return await fetch(`${this.#url}/products`).then(r => r.json());
        // return await fetch(`${this.#url}/products`).then(r => r.text());
    }
    async makeOrder(productId, deliveryAdderss, transactionAddress, phone) {
        const body = JSON.stringify({ productId, deliveryAdderss, transactionAddress, phone });
        const res = await fetch(`${this.#url}/makeOrder`, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body,
        }).then(r => r.json());

        return res;
    }
}