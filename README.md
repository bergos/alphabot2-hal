# alphabot2-hal

Hardware abstraction layer for [AlphaBot2-PiZero](https://www.waveshare.com/wiki/AlphaBot2-PiZero).

Heavily inspired by [alphabot-hal](https://github.com/rakeshpai/alphabot-hal).

## Example

This simple example shows how to start and stop the API and how to move the wheels to move forward for 0.5s:

```
const alphabot2 = require('alphabot2-hal')

const bot = alphabot2.Standard()

bot.start().then(() => {
  return bot.wheels.move(0.0, 1.0, 500)
}).then(() => {
  return bot.stop()
})
```

## API

There are two different interfaces:

- `Raw`: Direct access without any clipping or post processing of the sensor data
- `Standard`: Clips the values to valid ranges and does post processing of sensor data, if required.

Both interfaces have the same properties and methods.

The interface is selected like this:

```
const alphabot2 = require('alphabot2-hal')

// raw interface
const raw = new alphabot2.Raw()

// standard interface
const bot = alphabot2.Standard()
```

The `.start` method must be called before any other method.
`.stop` must be called at the end.
A handler for the `SIGINT` signal can be useful. 
All methods return `Promise`.

### battery

- `.voltage()`: Returns the current voltage coming from the batteries.

### camera

- `.move(x, y)`: Moves the camera arm to the given coordinates.
- `.x`: The value of the x axis
- `.y`: The value of the y axis

The values for the axis must be given in the following ranges:

- x axis: lef(0.0), middle(0.5), right(1.0)
- y axis: bottom(0.0), middle(0.5), top(1.0)

### infraredRemoteControl

- `.code()`: Reads the code of the pressed key.
If no key was pressed or detected after a while, the method returns `undefined`. 

### obstacleDetection

- `.detect()`: Returns an object with properties `left` and `right` which are true if an obstacle was detected.
- `.left()`: Returns only the flag of the left sensor.
- `.right()`: Returns only the flag of the right sensor.

### rangeFinder

- `.distance()`: Returns the distance in meters.

### speaker

- `.play(frequency)`: Plays a sound with the given `frequency`.
Set the frequency to `0` to turn the speaker off.

### wheels

- `.move(left, right, time)`: Turns the wheels with the given direction.
`time` must be given in ms.
`time` is not supported by the Raw interface.

The values for the wheels must be given in the following range:

- counter clockwise(0.0), stop(0.5), clockwise(1.0)

## Command Line Tool

There is a command line tool to control all modules and read all sensor data of the robot.
Check the usage for all possible commands:

```
alphabot2-hal --help
```

## Config

On start the `alphabot2.json` file from the cwd is read or the file given in the options will be used.
The following modules can be configured with a property with the same name:

### camera

- `limit`: A range to limit the camera movement.
Expects the following structure:
```
{
  "x": {"min": ?, "max": ?},
  "y": {"min": ?, "max": ?}
}
```
See the documentation of the camera interface for details of valid values.
  
- `offset`: An offset to calibrate the camera.
Expects the following structure:
```
{
  "x": ?,
  "y": ?
}
```
See the documentation of the camera interface for details of valid values.
