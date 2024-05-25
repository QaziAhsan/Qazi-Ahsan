document.addEventListener('DOMContentLoaded', function() {
  // Event listener for Quick View buttons
  document.querySelectorAll('.quick-view-btn').forEach(button => {
    button.addEventListener('click', function() {
      console.log("clicked");
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
            <p>${Shopify.formatMoney(product.price)}</p>
            <p>${product.description}</p>
            <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
          </div>
        `;
        document.getElementById('quick-view-modal').style.display = 'block';
        
        // Add to cart functionality
        document.querySelector('.add-to-cart-btn').addEventListener('click', function() {
          const productId = this.getAttribute('data-product-id');
          addToCart(productId, 1);
        });
      });
  }

  // Add product to cart
  function addToCart(productId, quantity) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: productId,
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
