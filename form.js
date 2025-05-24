(function () {
    const authorInput = document.querySelector('[name="author"]')
    const authorhandleInput = document.querySelector('[name="authorhandle"]')
    const packageInput = document.querySelector('[name="package"]')

    authorInput.addEventListener("change", (e) => {
        const changed = CaseMaster(e.target.value).lowerCase;

        if (!authorhandleInput.value) {
            authorhandleInput.value = changed;
        }
        if (!packageInput.value) {
            packageInput.value = changed;
        }
    })
})();