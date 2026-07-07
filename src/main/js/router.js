async function navigate(moduleName) {
  const res = await fetch(`./src/main/html/module/${moduleName}.html`);
  document.getElementById('pageContent').innerHTML = await res.text();
}
