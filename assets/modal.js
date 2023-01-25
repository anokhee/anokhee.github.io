// Modal Setup
var modal = document.getElementById("modal");

var modalClose = document.getElementById("modal-close");
modalClose.addEventListener("click", function () {
  modal.style.display = "none";
});

document.onkeydown = function (evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
    isEscape = evt.key === "Escape" || evt.key === "Esc";
  } else {
    isEscape = evt.keyCode === 27;
  }
  if (isEscape) {
    modal.style.display = "none";
  }
};

// global handler
document.addEventListener("click", function (e) {
  if (e.target.className.indexOf("modal-target") !== -1) {
    var img = e.target;
    var modalImg = document.getElementById("modal-content");
    var captionText = document.getElementById("modal-caption");
    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;
  }
});
