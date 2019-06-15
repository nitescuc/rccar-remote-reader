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

              this.value = this.config.isSwitch ? this.remapSwitch(diff) : this.remap(diff);
              
              if (this.config.callback) this.config.callback(this, value);
            }
        });
    }
    getValue() {
        return this.value;
    }
    remapSwitch(value) {
        const remap = this.config.remapValues;
        if (!remap) return value < 1500 ? false : true;
        else return value < 1500 ? remap[0] : remap[1];
    }
    remap(value) {
        const remap = this.config.remapValues;
        if (!remap) return value;

        if (value < 1000) return remap[0];
        if (value > 2000) return remap[1];

        const X_range = 1000;
        const Y_range = remap[1] - remap[0];
        const XY_ratio = X_range/Y_range
    
        return ((value - 1000) / XY_ratio + remap[0]);
    }
}

module.exports = {
    RemoteChannel
}