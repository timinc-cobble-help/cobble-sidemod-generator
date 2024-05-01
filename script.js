async function modifyAndDownloadZip() {
    const repoUrl = document.getElementById('repoUrl').value;
    const fileName = document.getElementById('fileName').value;
    const fileContent = document.getElementById('fileContent').value;

    // Convert GitHub repo link to a ZIP download link
    const zipUrl = repoUrl.replace(/(https:\/\/github\.com\/)(.+)/, '$1$2/archive/refs/heads/main.zip');

    // AllOrigins proxy
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(zipUrl)}`;

    // Use AllOrigins proxy
    const response = await fetch(proxyUrl);
    const blob = await response.blob();

    // Load ZIP file with JSZip
    const jsZip = new JSZip();
    const zip = await jsZip.loadAsync(blob);

    // Add a new file or modify existing ones
    zip.file(fileName, fileContent);

    // Generate the modified ZIP file and trigger download
    zip.generateAsync({ type: "blob" }).then(function (content) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = "modified_repo.zip";
        a.click();
    });
}

const downloadButton = document.querySelector("#download-btn");
downloadButton.addEventListener("click", modifyAndDownloadZip);