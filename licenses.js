window.LicenseMaster = (function () {
    async function getList() {
        const response = await fetch("https://api.github.com/licenses")
        return await response.json();
    }

    async function getText(license) {
        const response = await fetch(`https://api.github.com/licenses/${license}`);
        const body = await response.json();
        return body.body;
    }

    async function populateText(license) {
        const output = document.querySelector("#license-text");
        if (!output) return;
        output.innerText = "...";

        const text = await getText(license);
        output.innerText = text;
    }

    async function populateSelect() {
        const select = document.querySelector('[name="license"]');
        if (!select) return;

        const list = await getList();

        list.forEach(({ key, name }) => {
            const option = document.createElement("option");
            option.value = key;
            option.innerText = name;
            select.appendChild(option);
        });

        select.addEventListener("change", (e) => {
            populateText(e.target.value)
        });
    }

    populateSelect();

    return { getText };
})();