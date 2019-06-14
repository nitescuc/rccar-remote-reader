const Gpio = require('pigpio').Gpio;

class RemoteChannel {
    constructor(config) {
        this.config = config;
        this.inputPin = new Gpio(this.config.pin, {mode: Gpio.INPUT, alert: true});
        this.inputPin.pullUpDown(Gpio.PUD_UP);
        this.inputPin.on('alert', (level, tick) => {
            if (level == 1) {
              this.startTick = tick;
            } else {
              const endTick = tick;
              const diff = (endTick >> 0) - (this.startTick >> 0); // Unsigned 32 bit arithmetic
              this.value = diff;
              //
              if (this.config.callback) this.config.callback(this, value);
            }
        });
    }
    getValue() {
        return this.value;
    }
}

module.exports = {
    RemoteChannel
}