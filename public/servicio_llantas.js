window.addEventListener("scroll", function(){
    var header = document.querySelector("header");
    header.classList.toggle("abajo",window.scrollY>0);
})

const windowBackground = document.getElementById('window-background')
const windowContainer = document.getElementById('window-container')
const openButton = document.getElementById('open-button')
const closeButton = document.getElementById('close-button')

const windowBackground2 = document.getElementById('window-background2')
const windowContainer2 = document.getElementById('window-container2')
const openButton2 = document.getElementById('open-button2')
const closeButton2 = document.getElementById('close-button2')


openButton.addEventListener('click', () =>windowBackground.style.display = 'flex')

const closeWindow = () => {
    windowContainer.classList.add('close')

    setTimeout(() => {
        windowContainer.classList.remove('close')
        windowBackground.style.display = 'none'
    }, 1000);
}

closeButton.addEventListener('click', () =>closeWindow())

window.addEventListener('click', e=> e.target == windowBackground && closeWindow())

openButton2.addEventListener('click', () =>windowBackground2.style.display = 'flex')

const closeWindow2 = () => {
    windowContainer2.classList.add('close')

    setTimeout(() => {
        windowContainer2.classList.remove('close')
        windowBackground2.style.display = 'none'
    }, 1000);
}

closeButton2.addEventListener('click', () =>closeWindow2())

window.addEventListener('click', e=> e.target == windowBackground2 && closeWindow2())