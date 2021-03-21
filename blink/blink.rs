/// This is an alternate implementation of `blink.ts` to test nothing but expected results.
use rusb::UsbContext;
use std::time::Duration;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let endpoint_addr = 0x80 | 5;
    let devices = rusb::Context::new().unwrap().devices().unwrap();
    for device in devices.iter() {
        if let Ok(device_descriptor) = device.device_descriptor() {
            if device_descriptor.vendor_id() == 9025 {
                let handle = device.open()?;
                let mut transfer_type: Option<rusb::TransferType> = None;
                let cnf = handle
                    .device() // -> Device<T>
                    .active_config_descriptor()?; // -> ConfigDescriptor<T>
                let interfaces = cnf.interfaces(); // -> Interfaces<'a>

                for interface in interfaces {
                    for descriptor in interface.descriptors() {
                        // InterfaceDescriptor in Vec<Interface<'a>>
                        let endpoint_desc = descriptor
                            .endpoint_descriptors()
                            .find(|s| s.address() == endpoint_addr);
                        if endpoint_desc.is_none() {
                            continue;
                        }
                        let e = endpoint_desc.unwrap();
                        transfer_type = Some(e.transfer_type());
                        println!("Max packet size: {}", e.max_packet_size());
                        // find the address of a Endpoint in every EndpointDescriptor of every InterfaceDescriptor.
                    }
                }
                println!("{:#?}", transfer_type);
                let sendData: Vec<u8> = vec![b'H'];
                handle.write_bulk(0x0 | 4, &sendData, Duration::new(0, 0))?;
                let mut data: Vec<u8> = Vec::with_capacity(64);
                handle.read_bulk(endpoint_addr, &mut data, Duration::new(0, 0))?;
                println!("{:#?}", data);
            }
        }
    }
    Ok(())
}
