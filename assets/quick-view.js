document.addEventListener("DOMContentLoaded", function () {
  quickView();
});

function quickView() {
  document.querySelectorAll(".quick-view").forEach(function (element) {
    element.addEventListener("click", function () {
       console.log("clicked");
      
      if (!document.getElementById("quick-view")) {
        var div = document.createElement("div");
        div.id = "quick-view";
        document.body.appendChild(div);
      }
      
       var product_handle = this.getAttribute('data-handle');
      var quickViewDiv = document.getElementById('quick-view');
      quickViewDiv.classList.add(product_handle);

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
        });
    });
  });
}
