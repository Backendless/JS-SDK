let currentDevice = null

const Device = {

  required() {
    if (!currentDevice) {
      throw new Error('Device is not defined. Please, run the Backendless.setupDevice')
    }

    return currentDevice
  },

  get() {
    return currentDevice
  },

  setup(deviceProps) {
    if (!deviceProps || !deviceProps.uuid || !deviceProps.platform || !deviceProps.version) {
      throw new Error('Device properties object must consist of fields "uuid", "platform" and "version".')
    }

    currentDevice = {
      uuid    : deviceProps.uuid,
      platform: deviceProps.platform.toUpperCase(),
      version : deviceProps.version
    }
  }
}

export default Device