// Icon lookup - uses if/else chain instead of object map (MakeCode STS compatible)
function _bridgeLookupIcon(name: string): number {
    if (name == "heart") return IconNames.Heart
    if (name == "happy") return IconNames.Happy
    if (name == "sad") return IconNames.Sad
    if (name == "yes") return IconNames.Yes
    if (name == "no") return IconNames.No
    if (name == "skull") return IconNames.Skull
    if (name == "duck") return IconNames.Duck
    if (name == "house") return IconNames.House
    if (name == "sword") return IconNames.Sword
    if (name == "target") return IconNames.Target
    if (name == "diamond") return IconNames.Diamond
    if (name == "square") return IconNames.SmallSquare
    if (name == "scissors") return IconNames.Scissors
    if (name == "ghost") return IconNames.Ghost
    if (name == "pitchfork") return IconNames.Pitchfork
    if (name == "umbrella") return IconNames.Umbrella
    if (name == "snake") return IconNames.Snake
    if (name == "butterfly") return IconNames.Butterfly
    if (name == "giraffe") return IconNames.Giraffe
    return -1
}

// State
let _bridgePairingCode = ""
let _bridgeShowingCode = false

// Boot: serial at 115200, send READY
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
serial.writeLine("READY")

// Handle incoming CMD:<action>:<payload>
function _bridgeHandleCommand(cmd: string): void {
    let colonIdx = cmd.indexOf(":")
    let action = ""
    let payload = ""
    if (colonIdx === -1) {
        action = cmd
    } else {
        action = cmd.substr(0, colonIdx)
        payload = cmd.substr(colonIdx + 1)
    }
    if (action == "display") {
        _bridgeShowingCode = false
        basic.showString(payload)
    } else if (action == "icon") {
        _bridgeShowingCode = false
        let icon = _bridgeLookupIcon(payload.toLowerCase())
        if (icon >= 0) {
            basic.showIcon(icon)
        } else {
            basic.showString(payload)
        }
    } else if (action == "beep") {
        _bridgeShowingCode = false
        music.playTone(Note.C5, music.beat(BeatFraction.Half))
    } else if (action == "clear") {
        _bridgeShowingCode = false
        basic.clearScreen()
    }
}

// Serial listener - process incoming lines
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let line = serial.readUntil(serial.delimiters(Delimiters.NewLine)).trim()
    if (line.length === 0) return
    if (line.indexOf("CODE:") === 0) {
        _bridgePairingCode = line.substr(5)
        _bridgeShowingCode = true
        basic.showString(_bridgePairingCode)
    } else if (line.indexOf("CMD:") === 0) {
        _bridgeHandleCommand(line.substr(4))
    }
})

// Background: keep showing pairing code on LED
basic.forever(function () {
    if (_bridgeShowingCode && _bridgePairingCode.length > 0) {
        basic.showString(_bridgePairingCode)
        basic.pause(500)
    } else {
        basic.pause(100)
    }
})

/**
 * Send data from micro:bit to Minecraft Education Edition
 * via the meews bridge server.
 */
//% weight=100 color=#FF6600 icon="\uf11b"
namespace MinecraftBridge {

    /**
     * Send a free-form message to Minecraft.
     * In Minecraft, this arrives as a mb:msg script event.
     * @param text the message text, eg: "hello"
     */
    //% blockId=bridge_send_message
    //% block="send message %text to Minecraft"
    //% text.defl="hello"
    //% weight=100
    export function sendMessage(text: string): void {
        serial.writeLine("MSG:" + text)
    }

    /**
     * Send a named sensor reading to Minecraft.
     * In Minecraft, this arrives as a mb:sensor script event.
     * @param name the sensor name, eg: "temperature"
     * @param value the sensor value, eg: 0
     */
    //% blockId=bridge_send_sensor
    //% block="send sensor %name value %value to Minecraft"
    //% name.defl="temperature"
    //% value.defl=0
    //% weight=90
    export function sendSensor(name: string, value: number): void {
        serial.writeLine("SENSOR:" + name + ":" + value)
    }

    /**
     * Send a named variable to Minecraft.
     * In Minecraft, this arrives as a mb:var script event.
     * @param name the variable name, eg: "score"
     * @param value the variable value, eg: 0
     */
    //% blockId=bridge_send_variable
    //% block="send variable %name value %value to Minecraft"
    //% name.defl="score"
    //% value.defl=0
    //% weight=80
    export function sendVariable(name: string, value: number): void {
        serial.writeLine("VAR:" + name + ":" + value)
    }
}
