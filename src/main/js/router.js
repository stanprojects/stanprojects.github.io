async function navigate(moduleName) {
  const res = await fetch(`./src/main/html/module/${moduleName}.html`);
  document.getElementById('pageContent').innerHTML = await res.text();
}

function initRouter() {
  document.getElementById('sidebarNav').addEventListener('click', e => {
    const item = e.target.closest('.nav-item[data-page]');
    if (item?.dataset.page) navigate(item.dataset.page);
  });
}
