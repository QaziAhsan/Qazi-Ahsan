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
        const optionsHTML = product.options.map((option, index) => `
          <div class="product-option">
            <label for="option-${index}">${option.name}</label>
            <select id="option-${index}" class="product-option-select" data-option-index="${index}">
              ${option.values.map(value => `<option value="${value}">${value}</option>`).join('')}
            </select>
          </div>
        `).join('');

        document.getElementById('quick-view-content-inner').innerHTML = `
          <div class="quick-view-image">
            <img src="${product.images[0]}" alt="${product.title}">
          </div>
          <div class="quick-view-details">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            ${optionsHTML}
            <p>${product.price)}</p>
            <button class="add-to-cart-btn" data-product-handle="${product.handle}">Add to Cart</button>
          </div>
        `;
        document.getElementById('quick-view-modal').style.display = 'block';

        // Add to cart functionality
        document.querySelector('.add-to-cart-btn').addEventListener('click', function() {
          const selectedOptions = Array.from(document.querySelectorAll('.product-option-select')).map(select => select.value);
          const selectedVariant = product.variants.find(variant => 
            variant.options.every((option, index) => option === selectedOptions[index])
          );
          if (selectedVariant) {
            addToCart(selectedVariant.id, 1);
          } else {
            alert('Selected variant not found!');
          }
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


