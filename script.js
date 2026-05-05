function getCartItems() {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
}

function saveCartItems(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
}

function getPurchasedItems() {
    return JSON.parse(localStorage.getItem('purchasedItems') || '[]');
}

function savePurchasedItems(items) {
    localStorage.setItem('purchasedItems', JSON.stringify(items));
}

function addToCart(itemTitle) {
    const cart = getCartItems();
    cart.push({ title: itemTitle, addedAt: new Date().toISOString() });
    saveCartItems(cart);
    window.location.href = 'cart.html';
}

function clearCart() {
    localStorage.removeItem('cartItems');
    renderCartItems();
}

function purchaseCart() {
    const cart = getCartItems();
    if (!cart.length) {
        return;
    }

    const purchased = getPurchasedItems();
    const purchasedWithDate = cart.map(item => ({
        ...item,
        purchasedAt: new Date().toISOString()
    }));

    savePurchasedItems(purchased.concat(purchasedWithDate));
    clearCart();
    window.location.href = 'account.html';
}

function clearPurchasedItems() {
    localStorage.removeItem('purchasedItems');
    renderAccountItems();
}

function renderCartItems() {
    const container = document.querySelector('.cart-items');
    if (!container) {
        return;
    }

    const cart = getCartItems();
    if (!cart.length) {
        container.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        return;
    }

    container.innerHTML = cart.map(item => {
        return `
            <div class="cart-item">
                <h3>${item.title}</h3>
                <p>Ticket added to cart.</p>
            </div>
        `;
    }).join('');
}

function renderAccountItems() {
    const container = document.querySelector('.account-items');
    if (!container) {
        return;
    }

    const purchased = getPurchasedItems();
    if (!purchased.length) {
        container.innerHTML = '<p class="empty-cart">No purchased tickets yet.</p>';
        return;
    }

    container.innerHTML = purchased.map(item => {
        return `
            <div class="cart-item">
                <h3>${item.title}</h3>
                <p>Purchased on ${new Date(item.purchasedAt).toLocaleDateString()}</p>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const itemTitle = button.getAttribute('data-item');
            addToCart(itemTitle);
        });
    });

    const clearButton = document.querySelector('.clear-cart');
    if (clearButton) {
        clearButton.addEventListener('click', clearCart);
    }

    const purchaseButton = document.querySelector('.purchase-cart');
    if (purchaseButton) {
        purchaseButton.addEventListener('click', purchaseCart);
    }

    const clearAccountButton = document.querySelector('.clear-account');
    if (clearAccountButton) {
        clearAccountButton.addEventListener('click', clearPurchasedItems);
    }

    renderCartItems();
    renderAccountItems();
});