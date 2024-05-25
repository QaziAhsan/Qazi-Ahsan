document.addEventListener('DOMContentLoaded', function () {
  var script = document.createElement('script');
  script.src = "//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js";
  script.onload = function () {
    quickView();
  };
  document.head.appendChild(script);
});

function quickView() {
  document.querySelectorAll('.quick-view').forEach(function (element) {
    element.addEventListener('click', function () {
      if (!document.getElementById('quick-view')) {
        var div = document.createElement('div');
        div.id = 'quick-view';
        document.body.appendChild(div);
      }

      var product_handle = this.getAttribute('data-handle');
      var quickViewDiv = document.getElementById('quick-view');
      quickViewDiv.className = product_handle;

      fetch(`/products/${product_handle}.js`)
        .then(response => response.json())
        .then(product => {
          var title = product.title;
          var type = product.type;
          var price = 0;
          var original_price = 0;
          var desc = product.description;
          var images = product.images;
          var variants = product.variants;
          var options = product.options;
          var url = `/products/${product_handle}`;

          document.querySelector('.qv-product-title').textContent = title;
          document.querySelector('.qv-product-type').textContent = type;
          document.querySelector('.qv-product-description').innerHTML = desc;
          document.querySelector('.view-product').setAttribute('href', url);

          var imageContainer = document.querySelector('.qv-product-images');
          imageContainer.innerHTML = '';
          images.forEach(function (image, i) {
            var imageEmbed = `<div><img src="${image.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png')}"></div>`;
            imageContainer.innerHTML += imageEmbed;
          });

          // Initialize slick carousel after images are loaded
          if (typeof $ !== 'undefined' && $.fn.slick) {
            $(imageContainer).slick({
              dots: false,
              arrows: false,
              respondTo: 'min',
              useTransform: false
            }).css('opacity', '1');
          }

          var optionsContainer = document.querySelector('.qv-product-options');
          optionsContainer.innerHTML = '';
          options.forEach(function (option, i) {
            var opt = option.name;
            var selectClass = `.option.${opt.toLowerCase()}`;
            var optionSelectionDiv = document.createElement('div');
            optionSelectionDiv.className = `option-selection-${opt.toLowerCase()}`;
            optionSelectionDiv.innerHTML = `<span class="option">${opt} ${i} option ${opt.toLowerCase()}</span>`;
            optionsContainer.appendChild(optionSelectionDiv);

            var select = document.createElement('select');
            select.className = `option ${opt.toLowerCase()}`;
            option.values.forEach(function (value) {
              var optionElement = document.createElement('option');
              optionElement.value = value;
              optionElement.textContent = value;
              select.appendChild(optionElement);
            });
            optionSelectionDiv.appendChild(select);
          });

          variants.forEach(function (v) {
            if (v.inventory_quantity === 0) {
              document.querySelector('.qv-add-button').disabled = true;
              document.querySelector('.qv-add-button').value = 'Sold Out';
              document.querySelector('.qv-add-to-cart').style.display = 'none';
              document.querySelector('.qv-product-price').textContent = 'Sold Out';
              document.querySelector('.qv-product-price').style.display = 'block';
            } else {
              price = (v.price / 100).toFixed(2);
              original_price = (v.compare_at_price / 100).toFixed(2);
              document.querySelector('.qv-product-price').textContent = `$${price}`;
              if (original_price > 0) {
                document.querySelector('.qv-product-original-price').textContent = `$${original_price}`;
                document.querySelector('.qv-product-original-price').style.display = 'block';
              } else {
                document.querySelector('.qv-product-original-price').style.display = 'none';
              }
              document.querySelector('select.option-0').value = v.option1;
              document.querySelector('select.option-1').value = v.option2;
              document.querySelector('select.option-2').value = v.option3;
              return false;
            }
          });
        });

      document.querySelectorAll('#quick-view select').forEach(function (select) {
        select.addEventListener('change', function () {
          var selectedOptions = Array.from(document.querySelectorAll('#quick-view select'))
            .map(select => select.value)
            .join(' / ');

          fetch(`/products/${product_handle}.js`)
            .then(response => response.json())
            .then(product => {
              product.variants.forEach(function (v) {
                if (v.title === selectedOptions) {
                  var price = (v.price / 100).toFixed(2);
                  var original_price = (v.compare_at_price / 100).toFixed(2);
                  var v_qty = v.inventory_quantity;
                  var v_inv = v.inventory_management;

                  document.querySelector('.qv-product-price').textContent = `$${price}`;
                  document.querySelector('.qv-product-original-price').textContent = `$${original_price}`;

                  if (v_inv === null) {
                    document.querySelector('.qv-add-button').disabled = false;
                    document.querySelector('.qv-add-button').value = 'Add to Cart';
                  } else {
                    if (v.inventory_quantity < 1) {
                      document.querySelector('.qv-add-button').disabled = true;
                      document.querySelector('.qv-add-button').value = 'Sold Out';
                    } else {
                      document.querySelector('.qv-add-button').disabled = false;
                      document.querySelector('.qv-add-button').value = 'Add to Cart';
                    }
                  }
                }
              });
            });
        });
      });

      // Initialize Fancybox
      $.fancybox({
        href: '#quick-view',
        maxWidth: 1040,
        maxHeight: 600,
        fitToView: true,
        width: '75%',
        height: '70%',
        autoSize: false,
        closeClick: false,
        openEffect: 'none',
        closeEffect: 'none',
        beforeLoad: function () {
          var product_handle = document.getElementById('quick-view').className;

          document.querySelector('.qv-add-button').addEventListener('click', function () {
            var qty = document.querySelector('.qv-quantity').value;
            var selectedOptions = Array.from(document.querySelectorAll('#quick-view select'))
              .map(select => select.value)
              .join(' / ');

            fetch(`/products/${product_handle}.js`)
              .then(response => response.json())
              .then(product => {
                var var_id;
                product.variants.forEach(function (v) {
                  if (v.title === selectedOptions) {
                    var_id = v.id;
                    processCart(var_id, qty);
                  }
                });
              });

            function processCart(var_id, qty) {
              fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  quantity: qty,
                  id: var_id
                })
              })
                .then(response => response.json())
                .then(() => {
                  document.querySelector('.qv-add-to-cart-response').classList.add('success');
                  document.querySelector('.qv-add-to-cart-response').innerHTML = `<span>${document.querySelector('.qv-product-title').textContent} has been added to your cart. <a href="/cart">Click here to view your cart.</a></span>`;
                })
                .catch(error => {
                  document.querySelector('.qv-add-to-cart-response').classList.add('error');
                  document.querySelector('.qv-add-to-cart-response').innerHTML = `<span><b>ERROR: </b>${error.description}</span>`;
                });
            }
          });

          document.querySelector('.fancybox-wrap').style.overflow = 'hidden !important';
        },
        afterShow: function () {
          document.getElementById('quick-view').style.display = 'none';
          document.getElementById('quick-view').innerHTML = content;
          document.getElementById('quick-view').style.opacity = '1';
          document.getElementById('quick-view').style.display = 'block';
          document.querySelector('.qv-product-images').classList.add('loaded');
        },
        afterClose: function () {
          var quickView = document.getElementById('quick-view');
          quickView.className = '';
          quickView.innerHTML = '';
        }
      });
    });
  });
}

window.addEventListener('resize', function () {
  if (document.getElementById('quick-view') && document.getElementById('quick-view').style.display === 'block') {
    if (typeof $ !== 'undefined' && $.fn.slick) {
      $('.qv-product-images').slick('setPosition');
    }
  }
});
