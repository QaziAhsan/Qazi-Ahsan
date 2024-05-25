document.addEventListener('DOMContentLoaded', function () {
quickView()
});

function quickView(){
  document.querySelectorAll('.quick-view').forEach(function (element) {
 element.addEventListener('click', function () {
   if (!document.getElementById('quick-view')) {
        var div = document.createElement('div');
        div.id = 'quick-view';
        document.body.appendChild(div);
      };
   console.log("clicked");
 });
  })
}