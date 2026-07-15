
const Colors = Object.freeze({
  Dark: 'dark',
  Light: 'light',
});

const ModuleTests = Object.freeze({
  id: 'tests',
  title: 'Unit tests',
});

const ModuleApis = Object.freeze({
  id: 'apis',
  title: 'API clients',
});

const ModuleSecrets = Object.freeze({
  id: 'secrets',
  title: 'Secrets and hashes',
});

let _colors = undefined
let _opened = undefined
let _module = undefined
const modules = [ModuleTests, ModuleApis, ModuleSecrets]

const ColorsSwitch = document.getElementById('ColorsSwitch')
const MenuSwitch = document.getElementById('MenuSwitch')
const Scrim = document.getElementById('Scrim')
const Modules = document.getElementById('Modules')
const ModuleTitle = document.getElementById('ModuleTitle')
const ModuleScreen = document.getElementById('ModuleScreen')
const StartBar = document.getElementById('StartBar')

function colorsOf(name) {
    return Object.values(Colors).includes(name) ? name : Colors.Dark;
}

function moduleOf(id) {
    for (const module of modules) {
        if (module.id === id) return module;
    }
    return ModuleTests;
}

function getState({ module = _module, colors = _colors } = {}) {
    return `#module=${_module.id}&colors=${colors}`
}

function renderColors(colors) {
    _colors = colors
    ColorsSwitch.textContent = colors
    document.documentElement.setAttribute('data-colors', colors)
    document.querySelector('link[rel="icon"]').href = colors === Colors.Dark
        ? './src/main/svg/favicon_dark.svg'
        : './src/main/svg/favicon_light.svg'
}

function renderOpened(opened) {
    _opened = opened
    StartBar.classList.toggle('opened', _opened === true)
    Scrim.classList.toggle('opened', _opened === true)
    const path = opened ? './src/main/svg/cross.svg' : './src/main/svg/menu.svg'
    MenuSwitch.querySelector('.Icon').style.mask = `url('${path}')`
}

async function renderModuleScreen(url) {
    const res = await fetch(url)
    const text = await res.text()
    ModuleScreen.innerHTML = text
    ModuleScreen.scrollTop = 0
}

function renderModule(module) {
    _module = module
    Modules.querySelectorAll('.ModuleItem').forEach((it) => {
        it.classList.toggle('selected', it.dataset.id === module.id)
    })
    ModuleTitle.textContent = module.title
    renderModuleScreen(`./src/main/html/${module.id}.html`)
}

function onStateChange({ module = _module, colors = _colors, opened = _opened }, needsToPush = false) {
    if (_module !== module) {
        renderModule(module)
    }
    if (_colors !== colors) {
        renderColors(colors)
    }
    if (_opened !== opened) {
        renderOpened(opened)
    }
    const expected = getState({ colors: colors })
    if (location.hash !== expected) {
        if (needsToPush) {
            history.pushState(null, '', expected)
        } else {
            history.replaceState(null, '', expected)
        }
    }
}

function onPopState(opened) {
    const params = new URLSearchParams(location.hash.slice(1))
    const colors = colorsOf(params.get('colors'))
    const module = moduleOf(params.get('module'))
    onStateChange({ colors: colors, module: module, opened: opened })
}

function initModules(modules) {
  Modules.replaceChildren()
  for (const module of modules) {
    const it = document.createElement('div')
    it.dataset.id = module.id
    it.className = 'Box Clickable ModuleItem'
    it.style.width = '100%'
    it.textContent = module.title
    Modules.appendChild(it)
  }
}

ColorsSwitch.addEventListener('click', () => {
    const colors = _colors === Colors.Dark ? Colors.Light : Colors.Dark
    onStateChange({ colors: colors })
})

MenuSwitch.addEventListener('click', () => {
    const opened = _opened === true ? false : true
    onStateChange({ opened: opened })
})

Scrim.addEventListener('click', () => {
    if (_opened === true) {
        onStateChange({ opened: false })
    }
})

Modules.addEventListener('click', (event) => {
    const it = event.target.closest('.ModuleItem')
    if (!it) return
    if (_module.id !== it.dataset.id) {
        onStateChange({ module: moduleOf(it.dataset.id), opened: false }, true)
    }
})

window.addEventListener('popstate', () => {
    onPopState(false)
})

initModules(modules)

onPopState(false)

Modules.querySelectorAll('.ModuleItem').forEach((it) => {
    const module = moduleOf(it.dataset.id)
    it.textContent = module.title
})
