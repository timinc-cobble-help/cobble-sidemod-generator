async function modifyAndDownloadZip(
  authorNameInput,
  authorHandleInput,
  sideModInput,
  descriptionInput,
  versionInput,
  loaderInput,
  licenseInput,
  packageInput
) {
  const repoUrl = `https://github.com/timinc-cobble-help/tims-cobblemon-sidemod-template-{version}-{loader}/archive/refs/heads/main.zip`;

  const repoZipUrl = URI.expand(
      repoUrl,
      {
        version: versionInput,
        loader: loaderInput,
      }
  )

  const repoProxyUrl = URI.expand(
      "https://api.allorigins.win/raw?url={target}",
      {
        target: repoZipUrl.toString(),
      }
  );

  const repoResponse = await fetch(repoProxyUrl.toString());
  const repoBlob = await repoResponse.blob();

  const repoZip = new JSZip();
  await repoZip.loadAsync(repoBlob, {
    checkCRC32: true,
  });

  const context = {
    authorName: CaseMaster(authorNameInput),
    authorHandle: CaseMaster(authorHandleInput),
    sideMod: CaseMaster(sideModInput),
    description: CaseMaster(descriptionInput),
    license: CaseMaster(licenseInput),
    package: CaseMaster(packageInput),
  };

  const createdZip = new JSZip();
  for (let repoFileNameI in repoZip.files) {
    const repoFile = repoZip.files[repoFileNameI];
    if (repoFile.dir) continue;
    const repoFileName = Handlebars.compile(repoFileNameI)(context)
      .replace("tims-cobblemon-sidemod-template", `cobblemon-${context.sideMod.lowerCase}`)
      .replace("-main", "");

    try {
      const createFileName = repoFileName;
      const repoFileContent = await repoFile.async("text");
      const createFileContent = Handlebars.compile(repoFileContent)(context);
      createdZip.file(createFileName, createFileContent);
      console.log(`Successfully translated file ${createFileName}`);
    } catch (error) {
      console.log(error);
      const repoFileContent = await repoFile.async("base64");
      createdZip.file(repoFileName, repoFileContent);
      console.log(`Successfully copied file ${repoFileName}`);
    }
  }

  const zip = await createdZip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(zip);
  a.download = `${context.sideMod.lowerCase}-${versionInput}-${loaderInput}.zip`;
  a.click();
}

const projectForm = document.querySelector("#project-form");
projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  await modifyAndDownloadZip(
      form.author.value,
      form.authorhandle.value,
      form.sidemod.value,
      form.description.value,
      form.version.value,
      form.loader.value,
      form.license.value,
      form.package.value
  );
});
