# pxt-microbit-bridge

micro:bit ↔ Minecraft Education Edition bridge extension.

Send messages, sensor readings and variables between your micro:bit and Minecraft via the [meews bridge server](https://github.com/gamenoodlesoup/minecraft-microbit-bridge).

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/gamenoodlesoup/pxt-microbit-bridge** and import

## Blocks

### Send Message
Send a free-form text message to Minecraft. Arrives as `mb:msg` script event.

```blocks
MinecraftBridge.sendMessage("hello")
```

### Send Sensor
Send a named sensor reading to Minecraft. Arrives as `mb:sensor` script event.

```blocks
MinecraftBridge.sendSensor("temperature", input.temperature())
```

### Send Variable
Send a named variable to Minecraft. Arrives as `mb:var` script event.

```blocks
MinecraftBridge.sendVariable("score", 42)
```

## Example

```blocks
input.onButtonPressed(Button.A, function () {
    MinecraftBridge.sendMessage("button_a")
})
input.onButtonPressed(Button.B, function () {
    MinecraftBridge.sendSensor("temperature", input.temperature())
})
```

## How it works

1. micro:bit boots → sends `READY` over serial at 115200 baud
2. Browser bridge sends `CODE:XXXX` → micro:bit displays the 4-char pairing code on LEDs
3. Student uses blocks to send data → serial → browser → meews server → Minecraft
4. Minecraft can send commands back → `CMD:display:Hello` → micro:bit scrolls "Hello"

## Incoming commands (automatic)

| Command | micro:bit action |
|---------|-----------------|
| `CMD:display:<text>` | Scroll text on LED |
| `CMD:icon:<name>` | Show built-in icon |
| `CMD:beep` | Play a tone |
| `CMD:clear` | Clear LED matrix |

## Protocol

Serial at 115200 baud, newline-delimited.

**micro:bit → browser:**
| Message | Format |
|---------|--------|
| Ready signal | `READY` |
| Text message | `MSG:<text>` |
| Sensor reading | `SENSOR:<name>:<value>` |
| Variable | `VAR:<name>:<value>` |

**browser → micro:bit:**
| Message | Format |
|---------|--------|
| Pairing code | `CODE:<4-char>` |
| Display text | `CMD:display:<text>` |
| Show icon | `CMD:icon:<name>` |
| Play beep | `CMD:beep` |
| Clear screen | `CMD:clear` |

## License

MIT

#### Metadata (used for search, entity rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
