document.addEventListener('DOMContentLoaded', function() {
  // Event listener for Quick View buttons
  document.querySelectorAll('.quick-view-btn').forEach(button => {
    button.addEventListener('click', function() {
      const productHandle = this.getAttribute('data-product-handle');
      fetchProductData(productHandle);
    });
  });

  // Close Quick View modal
  document.querySelector('.close-quick-view').addEventListener('click', function() {
    document.getElementById('quick-view-modal').style.display = 'none';
  });

  // Fetch product data and display it in the modal
  function fetchProductData(handle) {
    fetch(`/products/${handle}.js`)
      .then(response => response.json())
      .then(product => {
        document.getElementById('quick-view-content-inner').innerHTML = `
          <div class="quick-view-image">
            <img src="${product.images[0]}" alt="${product.title}">
          </div>
          <div class="quick-view-details">
            <h2>${product.title}</h2>
            <p>${formatMoney(product.variants[0].price)}</p>
            <p>${product.description}</p>
            <button class="add-to-cart-btn" data-product-id="${product.variants[0].id}">Add to Cart</button>
          </div>
        `;
        document.getElementById('quick-view-modal').style.display = 'block';

        // Add to cart functionality
        document.querySelector('.add-to-cart-btn').addEventListener('click', function() {
          const variantId = this.getAttribute('data-product-id');
          addToCart(variantId, 1);
        });
      });
  }

  // Add product to cart
  function addToCart(variantId, quantity) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    })
    .then(response => response.json())
    .then(data => {
      alert('Product added to cart!');
      document.getElementById('quick-view-modal').style.display = 'none';
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  // Custom money formatting function
  function formatMoney(cents, format = "${{amount}}") {
    if (typeof cents == 'string') {
      cents = cents.replace('.', '');
    }

    const value = (cents / 100).toFixed(2);
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 1).toFixed(precision);

      const parts = number.split('.');
      const dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      const centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (format.match(placeholderRegex)[1]) {
      case 'amount':
        return formatWithDelimiters(value, 2, ',', '.');
      case 'amount_no_decimals':
        return formatWithDelimiters(value, 0, ',', '.');
      case 'amount_with_comma_separator':
        return formatWithDelimiters(value, 2, '.', ',');
      case 'amount_no_decimals_with_comma_separator':
        return formatWithDelimiters(value, 0, '.', ',');
    }

    return value;
  }
});
