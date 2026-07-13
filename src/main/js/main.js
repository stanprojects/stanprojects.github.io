
const Colors = Object.freeze({
  Dark: 'dark',
  Light: 'light',
});

let _colors = undefined
let _opened = undefined

const ColorsSwitch = document.getElementById('ColorsSwitch')
const MenuSwitch = document.getElementById('MenuSwitch')

function colorsOf(name) {
    return Object.values(Colors).includes(name) ? name : Colors.Dark;
}

function getState({ colors = _colors } = {}) {
    return `#colors=${colors}`
}

function renderColors(colors) {
    _colors = colors
    ColorsSwitch.textContent = colors
    document.documentElement.setAttribute('data-colors', colors)
}

function renderOpened(opened) {
    _opened = opened
    MenuSwitch.textContent = _opened === true ? 'close' : 'menu'
//    StartBar.classList.toggle('opened', _opened === true)
//    Scrim.classList.toggle('opened', _opened === true)
}

function onStateChange({ colors = _colors, opened = _opened }, needsToPush = false) {
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
    onStateChange({ colors: colors, opened: opened })
}

ColorsSwitch.addEventListener('click', () => {
    const colors = _colors === Colors.Dark ? Colors.Light : Colors.Dark
    onStateChange({ colors: colors })
})

MenuSwitch.addEventListener('click', () => {
    const opened = _opened === true ? false : true
    onStateChange({ opened: opened })
})

window.addEventListener('popstate', () => {
    onPopState(false)
})

onPopState(false)
