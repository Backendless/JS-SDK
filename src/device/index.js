export default class Device {
  constructor(device) {
    if (!device || !device.uuid || !device.platform || !device.version) {
      throw new Error('Device properties object must consist of fields "uuid", "platform" and "version".')
    }

    this.uuid = device.uuid
    this.platform = device.platform.toUpperCase()
    this.version = device.version
  }
}
