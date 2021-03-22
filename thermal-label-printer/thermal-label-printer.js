import { reset, setCharacterStyle, printImage } from "https://raw.githubusercontent.com/samccone/thermal_print/master/driver.ts";
import imageData from "./image.ts";

const devices = await navigator.usb.getDevices();
const selector = devices.map((d, i) => `${i}) ${d.productName}`).join("\n");
const idx = prompt(selector);
const device = devices[Number(idx)];


for (const config of device.configurations) {
    for (const iface of config.interfaces) {
      if (!iface.claimed) {
        await device.claimInterface(iface.interfaceNumber);
        break;
    }
  }
}

await reset(device);
await setCharacterStyle(device, {
    smallFont: false,
    emphasized: false,
    underline: false,
    doubleWidth: false,
    doubleHeight: false
});
  
await printImage(device, imageData, 24);
