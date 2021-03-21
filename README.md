## `webusb-examples`

> See pull request
> [deno/denoland#9550](https://github.com/denoland/deno/pull/9550) for the
> WebUSB implementation status.

Examples for using the WebUSB API with Deno. Most of the examples here are based
on `webusb/arduino` repository.

### Running

For running Arduino examples, make sure `WebUSB.h` library is available in your
Arduino libraries directory. You can find them here -
[`github.com/webusb/arduino`](https://github.com/webusb/arduino)

```shell
cd <example>

# For arduino examples (compile & upload sketches):
arduino-cli compile --fqbn arduino:avr:leonardo .
arduino-cli upload -p /dev/ttyACM0 --fqbn arduino:avr:leonardo .

sudo target/release/deno run --unstable --allow-usb <example/example.ts>
```

> NOTE: There are ALTERNATIVE Rust implementations for every examples to be able
> to test against. Both Deno & Rust sources should produce identical results.
