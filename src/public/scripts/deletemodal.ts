document.addEventListener("DOMContentLoaded", () => {
    const deleteBtn = document.getElementById("deleteBtn")! as HTMLButtonElement
    const deleteReviewForm = document.getElementById("deleteReviewForm")! as HTMLFormElement;
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")! as HTMLButtonElement;
    const deleteModal = document.getElementById( "deleteModal" )! as HTMLElement;
    
    const showModal = () => {
        deleteModal.style.display = "block";
        deleteModal.classList.add("show")
    }

    const hideModal = () => {
        deleteModal.style.display = "none";
        deleteModal.classList.remove("show");
    }
    deleteReviewForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        showModal();
    })

    // deleteBtn?.addEventListener("click", () => {
    //     showModal()
    // })

    deleteModal?.querySelectorAll("[data-dismiss='modal']").forEach(e => e.addEventListener("click", () => {
        hideModal();
    }));

    confirmDeleteBtn?.addEventListener("click", () => {
        hideModal()
        deleteReviewForm.submit(); // Submit the form
    });

    window.addEventListener("click", (event) => {
        if (event.target === deleteModal) {
            hideModal()
        }
    })
});