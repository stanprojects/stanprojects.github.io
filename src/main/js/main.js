
const Colors = Object.freeze({
  Dark: 'dark',
  Light: 'light',
});

const ModuleFoo = Object.freeze({
  id: 'foo',
  button: 'foo button',
  title: 'foo title',
  path: './src/main/html/foo.html',
});

const ModuleBar = Object.freeze({
  id: 'bar',
  button: 'bar button',
  title: 'bar title',
  path: './src/main/html/bar.html',
});

let _colors = undefined
let _opened = undefined
let _module = undefined

const ColorsSwitch = document.getElementById('ColorsSwitch')
const MenuSwitch = document.getElementById('MenuSwitch')
const Scrim = document.getElementById('Scrim')
const Modules = document.getElementById('Modules')

function colorsOf(name) {
    return Object.values(Colors).includes(name) ? name : Colors.Dark;
}

function moduleOf(id) {
    switch (id) {
        case ModuleBar.id:
            return ModuleBar;
        default:
            return ModuleFoo;
    }
}

function getState({ module = _module, colors = _colors } = {}) {
    return `#module=${_module.id}&colors=${colors}`
}

function renderColors(colors) {
    _colors = colors
    ColorsSwitch.textContent = colors
    document.documentElement.setAttribute('data-colors', colors)
}

function renderOpened(opened) {
    _opened = opened
    MenuSwitch.textContent = _opened === true ? 'close' : 'menu'
    StartBar.classList.toggle('opened', _opened === true)
    Scrim.classList.toggle('opened', _opened === true)
}

function renderModules(selected) {
    Modules.querySelectorAll('.ModuleItem').forEach((it) => {
        it.classList.toggle('selected', it.dataset.id === selected.id)
    })
}

function renderModule(module) {
    _module = module
    renderModules(module)
//    renderModuleScreen(selected)
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

onPopState(false)
