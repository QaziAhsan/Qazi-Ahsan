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


});
