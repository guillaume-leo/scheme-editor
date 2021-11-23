let pressed: string;
let lastPressed: string;
let isDoublePress: boolean;

const handleDoublePressAlt = (key: {key:any}) => {
    if (key.key === 'Alt') {
        this.cmdSystem(this.cmd(), 'key')
        if (this.focusedEditor) this.storedRef = this.focusedEditor
        this.storedRef.contentDOM?.blur()
                

    }
}

const timeOut = () => setTimeout(() => isDoublePress = false, 250);

const keyPress = (key: any) => {
    pressed = key.keyCode;

    if (isDoublePress && pressed === lastPressed) {
        isDoublePress = false;
        handleDoublePressAlt(key);
    } else {
        isDoublePress = true;
        timeOut();
    }

    lastPressed = pressed;
}

window.onkeyup = key => keyPress(key)


