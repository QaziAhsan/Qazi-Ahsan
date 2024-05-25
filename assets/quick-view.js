document.addEventListener("DOMContentLoaded", function () {
  quickView();
});

function quickView() {
  document.querySelectorAll(".quick-view").forEach(function (element) {
    element.addEventListener("click", function () {
      if (!document.getElementById("quick-view")) {
        var div = document.createElement("div");
        div.id = "quick-view";
        document.body.appendChild(div);
      }
      
       var product_handle = this.getAttribute('data-handle');
      var quickViewDiv = document.getElementById('quick-view');
      quickViewDiv.className = product_handle;
      
      console.log("clicked");
    });
  });
}
