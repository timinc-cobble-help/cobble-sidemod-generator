const toKebabCase = s => s.split(" ").map(e => e.toLowerCase()).join("-");
const toLowerCase = s => s.split(" ").map(e => e.toLowerCase()).join("");
const toUpperCase = s => s.split(" ").map(e => `${e[0].toUpperCase()}${e.slice(1).toLowerCase()}`).join("");
const toCamelCase = s => {
    const upperCase = toUpperCase(s);
    return `${upperCase[0].toLowerCase()}${upperCase.slice(1)}`
};

async function modifyAndDownloadZip(authorNameInput, sideModInput, descriptionInput, versionInput, loaderInput) {
    const repoUrl = `https://github.com/timinc-cobble/tims-cobblemon-sidemod-template-${versionInput}-${loaderInput}`;
    const repoZipUrl = repoUrl.replace(/(https:\/\/github\.com\/)(.+)/, '$1$2/archive/refs/heads/main.zip');
    const repoProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(repoZipUrl)}`;

    const repoResponse = await fetch(repoProxyUrl);
    const repoBlob = await repoResponse.blob();

    const repoZip = new JSZip();
    await repoZip.loadAsync(repoBlob, {
        checkCRC32: true
    });

    const context = {
        authorname: toLowerCase(authorNameInput),
        sidemod: toLowerCase(sideModInput),
        SideMod: toUpperCase(sideModInput),
        "side-mod": toKebabCase(sideModInput),
        Side_Mod: sideModInput,
        sideMod: toCamelCase(sideModInput),
        description: descriptionInput,
    }

    const createdZip = new JSZip();
    for (let repoFileNameI in repoZip.files) {
        const repoFile = repoZip.files[repoFileNameI];
        if (repoFile.dir) continue;
        const repoFileName = Handlebars.compile(repoFileNameI)(context).replace("tims-cobblemon-sidemod-template", context["side-mod"]).replace("-main", "");
        const repoFileContent = await repoFile.async("text");

        try {
            const createFileName = repoFileName;
            const createFileContent = Handlebars.compile(repoFileContent)(context);
            createdZip.file(createFileName, createFileContent);
            console.log(`Successfully translated file ${createFileName}`)
        } catch (error) {
            console.log(error);
            createdZip.file(repoFileName, repoFileContent);
            console.log(`Successfully copied file ${repoFileName}`)
        }
    }

    createdZip.generateAsync({ type: "blob" }).then(function (content) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = `${context.sideMod}.zip`;
        a.click();
    });
}

const projectForm = document.querySelector("#project-form");
projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    modifyAndDownloadZip(form.author.value, form.sidemod.value, form.description.value, form.version.value, form.loader.value);
});