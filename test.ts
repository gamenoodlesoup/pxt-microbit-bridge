// Test file — used when testing inside MakeCode editor

// Send a message when button A is pressed
input.onButtonPressed(Button.A, function () {
    MinecraftBridge.sendMessage("button_a")
})

// Send temperature reading when button B is pressed
input.onButtonPressed(Button.B, function () {
    MinecraftBridge.sendSensor("temperature", input.temperature())
})

// Send a random score when A+B pressed together
input.onButtonPressed(Button.AB, function () {
    MinecraftBridge.sendVariable("score", Math.randomRange(0, 100))
})
