// 1. Connect
const devices = await navigator.usb.getDevices();
const device = devices.find((p) => p.vendorId == 1046);

// 2. Setup
await device.open();
await device.selectConfiguration(0);
await device.claimInterface(0);

// 3. Transfer
const data = new TextEncoder().encode("Hello Deno!");
await device.transferOut(1, data);
