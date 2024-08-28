import bsCustomFileInput from "bs-custom-file-input"

const h = () => {
    // 'use strict'
    bsCustomFileInput.init()
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault()
            if (!(form as HTMLFormElement).checkValidity()) {
               
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
}
export default h();