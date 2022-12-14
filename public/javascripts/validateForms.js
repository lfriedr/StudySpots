(function () {
  "use strict";
  // for file upload
  bsCustomFileInput.init()
  // fetch forms that need custom validation styles
  const forms = document.querySelectorAll(".validated-form");
  // loop through forms & prevent submission if invalid
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    )
  })
})();
