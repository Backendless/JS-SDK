export default class Device {
  constructor(props) {
    if (!props || !props.uuid || !props.platform || !props.version) {
      throw new Error('Device properties object must consist of fields "uuid", "platform" and "version".')
    }

    this.uuid = props.uuid
    this.platform = props.platform.toUpperCase()
    this.version = props.version
  }
}