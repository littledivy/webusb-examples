// Prorgramming Logitech G102 Lightsync devices via WebUSB.
//
// NOTE: HID Devices need to be detached from their kernel drivers. This functionality is not provided by WebUSB due to platform compatibility issues.
// See https://bugs.chromium.org/p/chromium/issues/detail?id=679314#c4
//
// Detach kernel driver using pyusb:
// ```
// import usb.core
// dev = usb.core.find(idVendor=0x046d, idProduct=0xc092)
// dev.detach_kernel_driver(1)
// ```

const devices = await navigator.usb.getDevices();

const dev = devices.find((dev) =>
  dev.vendorId == 0x046d && dev.productId == 0xc092
);

if (!dev) throw new Error("Device not found");

const wIndex = 0x01;

// color must be in RRGGBB format.
async function setSolid(color) {
  const wValue = color.length == 14 ? 0x210 : 0x211;

  // Disable on board memory
  await dev.controlTransferOut({
    requestType: "class",
    recipient: "interface",
    request: 0x09,
    value: 0x210,
    index: wIndex,
  }, fromHexString("10ff0e5b010305"));

  await dev.transferIn(2, 20);

  const command = "11ff0e1b0001" + color + "0000000000000001000000";

  await dev.controlTransferOut({
    requestType: "class",
    recipient: "interface",
    request: 0x09,
    value: wValue,
    index: wIndex,
  }, fromHexString(command));
  await dev.transferIn(2, 20);
}

const fromHexString = (hexString) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

await dev.open();

await dev.claimInterface(wIndex & 0xFF);
while (true) {
  const color = prompt("Lightsync>");
  if (color.trim().toLowerCase() == "exit") {
    break;
  }
  await setSolid(color);
  console.log("Done");
}

await dev.close();
console.log("Bye!");
