async function navigate(moduleName) {
  const res = await fetch(`./src/main/html/module/${moduleName}.html`);
  document.getElementById('moduleView').innerHTML = await res.text();
}

function initRouter() {
  document.getElementById('leftBarItemsView').addEventListener('click', e => {
    const item = e.target.closest('.leftBarItemStyle[data-page]');
    if (item?.dataset.page) navigate(item.dataset.page);
  });
}
