const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
let productsList = [];

class Cart {
  constructor() {
    this.totalPrice = 0;
    this.products = {};
  }
  addProduct(productTitle, productPrice) {
      let product = this.products[productTitle];
      let quantity = 0;
      if (product) {
        quantity = product.quantity;
      }
      this.products[productTitle] = {price: productPrice, quantity: quantity + 1};
      this.totalPrice += productPrice;
  }
}

let cart = new Cart();

let getProductsList = (url) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    if (!url) {
      reject('url is empty');
    }
    xhr.open('GET', url, true);

    xhr.onload = function () {
      if (this.status == 200) {
        let products = JSON.parse(this.response);
        resolve(products);
      } else {
        reject('something is wrong with your request');
      }
    };
    xhr.onerror = function () {
      reject(new Error("Network Error"));
    };

    xhr.send();
  })
  
}

const renderProductsItem = (title, price, index) => {
  let product = `<div class="products-item"><img><h3>${title}</h3><p>${price}</p><button data-productId=${index} class="buy">Купить</button></div>`;
  document.querySelector('.products-list').insertAdjacentHTML('beforeend', product);
};

const renderProductsList = (list) => {
  for (let i = 0; i < list.length; i++) {
    let product = list[i];
    renderProductsItem(product.product_name, product.price, i)
  }
}

function addProductToCart(event) {
  let button = event.target;
  let productId = button.getAttribute('data-productId');
  let product = productsList[productId];
  let productPrice = product.price;
  let productTitle = product.product_name;
  cart.addProduct(productTitle, productPrice);
  document.querySelector('.cart-block').insertAdjacentHTML('beforeend', `<h3>${productTitle}</h3><p>${productPrice}</p><br><h3>Total price: ${cart.totalPrice}</h3>`)
}

getProductsList(`${API_URL}/catalogData.json`).then(result => {
    productsList = result;
    renderProductsList(result);

    let buttons = document.querySelectorAll('.buy');
    for (button of buttons) {
      button.addEventListener('click', addProductToCart);
    }
  })
  .catch(error => {
    console.log(error);
  });




