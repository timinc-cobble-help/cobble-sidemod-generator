const toKebabCase = s => s.split(" ").map(e => e.toLowerCase()).join("-");
const toLowerCase = s => s.split(" ").map(e => e.toLowerCase()).join("");
const toUpperCase = s => s.split(" ").map(e => `${e[0].toUpperCase()}${e.slice(1).toLowerCase()}`).join("");
const toCamelCase = s => {
    const upperCase = toUpperCase(s);
    return `${upperCase[0].toLowerCase}${upperCase.slice(1)}`
};

async function modifyAndDownloadZip() {
    const repoUrl = document.getElementById('repoUrl').value;
    const repoZipUrl = repoUrl.replace(/(https:\/\/github\.com\/)(.+)/, '$1$2/archive/refs/heads/main.zip');
    const repoProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(repoZipUrl)}`;

    const repoResponse = await fetch(repoProxyUrl);
    const repoBlob = await repoResponse.blob();

    const repoZip = new JSZip();
    await repoZip.loadAsync(repoBlob, {
        checkCRC32: true
    });

    const authorNameInput = "Timothy Metcalfe";
    const sideModInput = "Some Mod";
    const descriptionInput = "This is some mod, isn't it sweet?"

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
        a.download = "modified_repo.zip";
        a.click();
    });
}

const downloadButton = document.querySelector("#download-btn");
downloadButton.addEventListener("click", modifyAndDownloadZip);