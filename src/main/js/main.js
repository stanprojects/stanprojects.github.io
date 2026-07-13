
const Colors = Object.freeze({
  Dark: 'dark',
  Light: 'light',
});

let _colors = undefined

function colorsOf(name) {
    return Object.values(Colors).includes(name) ? name : Colors.Dark;
}

function getState({ colors = _colors } = {}) {
    return `#colors=${colors}`
}

function renderColors(colors) {
    _colors = colors
    document.documentElement.setAttribute('data-colors', colors)
}

function onStateChange({ colors = _colors }, needsToPush = false) {
    if (_colors !== colors) {
        renderColors(colors)
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

function onPopState() {
    const params = new URLSearchParams(location.hash.slice(1))
    const colors = colorsOf(params.get('colors'))
    onStateChange({ colors: colors })
}

window.addEventListener('popstate', () => {
    onPopState()
})

onPopState()
