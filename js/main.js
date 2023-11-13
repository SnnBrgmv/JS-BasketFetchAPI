const productsContainer = document.getElementById('productsContainer');
const cart = [];
const cartCount = document.getElementById('cartCount');

const savedCart = JSON.parse(localStorage.getItem('cart'));
if (savedCart) {
    cart.push(...savedCart);
    updateCart();
}

fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => {
        data.products.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    })
    .catch(error => console.error('Failed to fetch products:', error));

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'col-4';

    const image = document.createElement('img');
    image.className = 'img-fluid product-image';
    image.src = product.thumbnail;
    image.alt = product.title;

    const title = document.createElement('h4');
    title.textContent = product.title;

    const price = document.createElement('p');
    price.textContent = `$${product.price}`;

    const addToCartButton = document.createElement('button');
    addToCartButton.className = 'btn btn-primary mb-5';
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.addEventListener('click', () => {
        cart.push(product);
        updateCart();
    });

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(addToCartButton);

    return card;
}

function updateCart() {
    const cartItemsList = document.getElementById('cartItems');
    cartItemsList.innerHTML = '';
    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.textContent = 'Your cart is empty.';
        cartItemsList.appendChild(emptyCartMessage);
    } else {
        const productQuantity = {};

        cart.forEach(item => {
            if (productQuantity[item.title]) {
                productQuantity[item.title]++;
            } else {
                productQuantity[item.title] = 1;
            }
        });

        let totalCartPrice = 0;

        for (const [title, quantity] of Object.entries(productQuantity)) {
            const product = cart.find(item => item.title === title);
            const li = document.createElement('li');
            li.style.listStyle = 'none';

            let totalPrice = product.price * quantity;

            const increaseButton = document.createElement('button');
            increaseButton.className = 'mx-3 p-1';
            increaseButton.textContent = '+';
            increaseButton.addEventListener('click', () => {
                cart.push(product);
                updateCart();
            });

            const decreaseButton = document.createElement('button');
            decreaseButton.className = 'p-1';
            decreaseButton.textContent = '-';
            decreaseButton.addEventListener('click', () => {
                if (quantity > 1) {
                    const index = cart.findIndex(item => item.title === title);
                    cart.splice(index, 1);
                    updateCart();
                }
            });


            li.textContent = `(${quantity}) ${title} ($${product.price}) - Total Price => $${totalPrice}`;
            li.appendChild(increaseButton);
            li.appendChild(decreaseButton);

            cartItemsList.appendChild(li);
            totalCartPrice += totalPrice;
        }

        const totalCartPriceElement = document.createElement('p');
        totalCartPriceElement.className = 'my-2 fw-bolder'
        totalCartPriceElement.textContent = `Total Cart Price: $${totalCartPrice}`;
        cartItemsList.appendChild(totalCartPriceElement);

        localStorage.setItem('cart', JSON.stringify(cart));
    }
}


const basketIcon = document.querySelector('.basket-icon');
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));

basketIcon.addEventListener('click', () => {
    updateCart();
    cartModal.show();
});


cartModal._element.addEventListener('hidden.bs.modal', () => {

});

const clearCartButton = document.createElement('button');
clearCartButton.className = 'btn btn-danger';
clearCartButton.textContent = 'Clear Cart';
clearCartButton.addEventListener('click', () => {
    cart.length = 0;
    updateCart();
    localStorage.removeItem('cart');
});

const cartModalContent = document.querySelector('.modal-content');
const modalFooter = document.createElement('div');
modalFooter.className = 'modal-footer';
modalFooter.appendChild(clearCartButton);
cartModalContent.appendChild(modalFooter);
