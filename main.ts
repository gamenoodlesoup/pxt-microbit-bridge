/**
 * micro:bit ↔ Minecraft Bridge Extension
 *
 * Serial protocol (115200 baud, newline-delimited):
 *
 * Upstream (micro:bit → browser):
 *   READY                  — sent on boot
 *   MSG:<text>             — free-form message
 *   SENSOR:<name>:<value>  — named sensor reading
 *   VAR:<name>:<value>     — named variable
 *
 * Downstream (browser → micro:bit):
 *   CODE:<4-char>          — display pairing code on LED
 *   CMD:display:<text>     — scroll text on LED
 *   CMD:icon:<name>        — show built-in icon
 *   CMD:beep               — play tone
 *   CMD:clear              — clear LED
 */

// Icon name → IconNames mapping for CMD:icon
const BRIDGE_ICON_MAP: { [key: string]: IconNames } = {
    heart: IconNames.Heart,
    happy: IconNames.Happy,
    sad: IconNames.Sad,
    yes: IconNames.Yes,
    no: IconNames.No,
    skull: IconNames.Skull,
    duck: IconNames.Duck,
    house: IconNames.House,
    sword: IconNames.Sword,
    target: IconNames.Target,
    diamond: IconNames.Diamond,
    square: IconNames.SmallSquare,
    scissors: IconNames.Scissors,
    ghost: IconNames.Ghost,
    pitchfork: IconNames.Pitchfork,
    umbrella: IconNames.Umbrella,
    snake: IconNames.Snake,
    butterfly: IconNames.Butterfly,
    giraffe: IconNames.Giraffe,
}

// State
let _bridgePairingCode = ""
let _bridgeShowingCode = false

// ─── Boot sequence ───────────────────────────────────────────────────
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
serial.writeLine("READY")

// ─── Serial listener — process incoming lines ───────────────────────
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    const line = serial.readUntil(serial.delimiters(Delimiters.NewLine)).trim()
    if (line.length === 0) return

    if (line.indexOf("CODE:") === 0) {
        _bridgePairingCode = line.substr(5)
        _bridgeShowingCode = true
        basic.showString(_bridgePairingCode)
    } else if (line.indexOf("CMD:") === 0) {
        _bridgeHandleCommand(line.substr(4))
    }
})

function _bridgeHandleCommand(cmd: string): void {
    const colonIdx = cmd.indexOf(":")
    let action = ""
    let payload = ""
    if (colonIdx === -1) {
        action = cmd
    } else {
        action = cmd.substr(0, colonIdx)
        payload = cmd.substr(colonIdx + 1)
    }

    switch (action) {
        case "display":
            _bridgeShowingCode = false
            basic.showString(payload)
            break
        case "icon":
            _bridgeShowingCode = false
            const icon = BRIDGE_ICON_MAP[payload.toLowerCase()]
            if (icon !== undefined) {
                basic.showIcon(icon)
            } else {
                basic.showString(payload)
            }
            break
        case "beep":
            _bridgeShowingCode = false
            music.playTone(Note.C5, music.beat(BeatFraction.Half))
            break
        case "clear":
            _bridgeShowingCode = false
            basic.clearScreen()
            break
    }
}

// ─── Background: keep showing pairing code on LED ────────────────────
basic.forever(function () {
    if (_bridgeShowingCode && _bridgePairingCode.length > 0) {
        basic.showString(_bridgePairingCode)
        basic.pause(500)
    } else {
        basic.pause(100)
    }
})

// ─── Student-facing blocks ──────────────────────────────────────────

/**
 * Blocks for sending data from micro:bit to Minecraft Education Edition
 * via the meews bridge server.
 */
//% weight=100 color=#FF6600 icon="\uf11b"
//% block="Minecraft Bridge"
//% groups=["Send", "Receive"]
namespace MinecraftBridge {

    /**
     * Send a free-form message to Minecraft.
     * In Minecraft, this arrives as a `mb:msg` script event.
     * @param text the message text, eg: "hello"
     */
    //% block="send message %text to Minecraft"
    //% blockId=bridge_send_message
    //% text.defl="hello"
    //% group="Send"
    //% weight=100
    export function sendMessage(text: string): void {
        serial.writeLine("MSG:" + text)
    }

    /**
     * Send a named sensor reading to Minecraft.
     * In Minecraft, this arrives as a `mb:sensor` script event.
     * @param name the sensor name, eg: "temperature"
     * @param value the sensor value, eg: 0
     */
    //% block="send sensor %name value %value to Minecraft"
    //% blockId=bridge_send_sensor
    //% name.defl="temperature"
    //% value.defl=0
    //% group="Send"
    //% weight=90
    export function sendSensor(name: string, value: number): void {
        serial.writeLine("SENSOR:" + name + ":" + value)
    }

    /**
     * Send a named variable to Minecraft.
     * In Minecraft, this arrives as a `mb:var` script event.
     * @param name the variable name, eg: "score"
     * @param value the variable value, eg: 0
     */
    //% block="send variable %name value %value to Minecraft"
    //% blockId=bridge_send_variable
    //% name.defl="score"
    //% value.defl=0
    //% group="Send"
    //% weight=80
    export function sendVariable(name: string, value: number): void {
        serial.writeLine("VAR:" + name + ":" + value)
    }
}
