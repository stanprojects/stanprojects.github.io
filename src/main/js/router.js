async function navigate(moduleName) {
  const res = await fetch(`./src/main/html/module/${moduleName}.html`);
  document.getElementById('pageContent').innerHTML = await res.text();
}

function initRouter() {
  document.getElementById('leftBarNav').addEventListener('click', e => {
    const item = e.target.closest('.navItem[data-page]');
    if (item?.dataset.page) navigate(item.dataset.page);
  });
}
