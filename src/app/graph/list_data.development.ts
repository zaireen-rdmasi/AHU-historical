export const graphData = {
  itemConfigMapAHUStatus: {
    raTemp: {
      id: 'raTemp',
      title: 'RA Temperature',
      value: 'Return-Air-Temp',
      unit: '°C',
      color: '#dc3545',
    },

    oaTemp: {
      id: 'oaTemp',
      title: 'OA Temperature',
      value: 'Fresh-Air-Temp',
      unit: '°C',
      color: '#fd7e14',
    },

    radStatus: {
      id: 'radStatus',
      title: 'RAD Status',
      value: 'RAD-Status',
      unit: '%',
      color: '#0dcaf0',
    },

    mixTemp: {
      id: 'mixTemp',
      title: 'MIX Temperature',
      value: 'Mixed-Air-Temp',
      unit: '°C',
      color: '#6f42c1',
    },

    cwpStatus: {
      id: 'cwpStatus',
      title: 'Pump Status',
      value: 'Pump-Status',
      unit: '',
      color: '#28a745',
    },

    filterStatus: {
      id: 'filterStatus',
      title: 'Filter Alarm',
      value: 'Filter-Alarm',
      unit: '',
      color: '#ffc107',
    },

    ccdaTemp: {
      id: 'ccdaTemp',
      title: 'CCDA Temperature',
      value: 'CCDA-Temp',
      unit: '°C',
      color: '#20c997',
    },

    saTemp: {
      id: 'saTemp',
      title: 'Supply Air Temp',
      value: 'Supply-Air-Temp',
      unit: '°C',
      color: '#0d6efd',
    },

    diffPress: {
      id: 'diffPress',
      title: 'Duct Diff Pressure',
      value: 'Duct-Diff-Pressure',
      unit: 'Pa',
      color: '#6610f2',
    },

    staticPress: {
      id: 'staticPress',
      title: 'Static Press',
      value: 'Duct-Static-Press',
      unit: 'Pa',
      color: '#adb5bd',
    },

    isodStatus: {
      id: 'isodStatus',
      title: 'ISOD Status',
      value: 'ISOD-Status',
      unit: '%',
      color: '#6c757d',
    },

    sadStatus: {
      id: 'sadStatus',
      title: 'SAD Status',
      value: 'SAD-Status',
      unit: '%',
      color: '#17a2b8',
    },

    roomHumidity: {
      id: 'roomHumidity',
      title: 'Room Humidity',
      value: 'Room-RH',
      unit: '%',
      color: '#198754',
    },

    chwsTemp: {
      id: 'chwsTemp',
      title: 'CHWS Temp',
      value: 'CHWS-Temp',
      unit: '%',
      color: '#198754',
    },

    chwrTemp: {
      id: 'chwrTemp',
      title: 'CHWR Temp',
      value: 'CHWR-Temp',
      unit: '%',
      color: '#6276dc',
    },

    roomTemp: {
      id: 'roomTemp',
      title: 'Room Temp',
      value: 'Room-Temp',
      unit: '%',
      color: '#787c94',
    },
  },

  itemConfigMapAHUVSD: {
    vsdSpeed: {
      id: 'vsdSpeed',
      title: 'VSD Speed',
      value: 'VSD-Speed',
      unit: '%',
      color: '#0d6efd',
    },

    vsdOutputFreq: {
      id: 'vsdOutputFreq',
      title: 'VSD Output Freq',
      value: 'VSD-Output-Freq',
      unit: 'Hz',
      color: '#17a2b8',
    },

    vsdCurrent: {
      id: 'vsdCurrent',
      title: 'VSD Current',
      value: 'VSD-Current',
      unit: 'A',
      color: '#ffc107',
    },

    vsdPower: {
      id: 'vsdPower',
      title: 'VSD Power',
      value: 'VSD-Power',
      unit: 'kW',
      color: '#dc3545',
    },

    vsdTorque: {
      id: 'vsdTorque',
      title: 'VSD Torque',
      value: 'VSD-Torque',
      unit: '%',
      color: '#6f42c1',
    },

    vsdDcBusVoltage: {
      id: 'vsdDcBusVoltage',
      title: 'VSD DC Bus Voltage',
      value: 'VSD-DC-Bus-Voltage',
      unit: 'V',
      color: '#20c997',
    },

    vsdDriveTemp: {
      id: 'vsdDriveTemp',
      title: 'VSD Drive Temp',
      value: 'VSD-Drive-Temp',
      unit: '°C',
      color: '#fd7e14',
    },

    vsdOutputVoltage: {
      id: 'vsdOutputVoltage',
      title: 'VSD Output Voltage',
      value: 'VSD-Output-Voltage',
      unit: 'V',
      color: '#6610f2',
    },

    vsdRunTime: {
      id: 'vsdRunTime',
      title: 'VSD Run Time',
      value: 'VSD-Run-Time',
      unit: 'hrs',
      color: '#198754',
    },

    vsdKwhCounter: {
      id: 'vsdKwhCounter',
      title: 'VSD kWh Counter',
      value: 'VSD-kWh-Counter',
      unit: 'kWh',
      color: '#0dcaf0',
    },
  },

  itemConfigMapFCUStatus: {
    raTemp: {
      id: 'raTemp',
      title: 'RA Temp',
      unit: '°C',
      color: '#dc3545',
    },

    chws: {
      id: 'chws',
      title: 'CHWS',
      unit: '°C',
      color: '#0d6efd',
    },

    chwr: {
      id: 'chwr',
      title: 'CHWR',
      unit: '°C',
      color: '#17a2b8',
    },

    saTemp: {
      id: 'saTemp',
      title: 'SA Temp',
      unit: '°C',
      color: '#fd7e14',
    },

    roomTemp: {
      id: 'roomTemp',
      title: 'Room Temp',
      unit: '°C',
      color: '#198754',
    },
  },

  itemConfigMapAHUControl: {
    ahuStatus: {
      id: 'ahuStatus',
      title: 'Status (On/Off)',
      value: 'Status',
      unit: '',
      color: '#28a745',
    },

    controlMode: {
      id: 'controlMode',
      title: 'Control Mode (On, Off, System Timer)',
      value: 'Control-Mode',
      unit: '',
      color: '#007bff',
    },

    schedule: {
      id: 'schedule',
      title: 'Schedule',
      value: 'GPT-Signal',
      unit: '',
      color: '#6f42c1',
    },

    controlModeInverter: {
      id: 'inverterControlMode',
      title: 'Control Mode (Inverter)',
      value: 'VSD-Control-Mode',
      unit: '',
      color: '#17a2b8',
    },

    overrideVSDSpeed: {
      id: 'overrideVSDSpeed',
      title: 'Override VSD',
      value: 'Override-VSD',
      unit: 'Hz',
      color: '#fd7e14',
    },

    controlModeCHW: {
      id: 'controlModeCHW',
      title: 'Control Mode (Chilled Water Valve)',
      value: 'Valve-Control-Mode',
      unit: '',
      color: '#20c997',
    },

    overrideValve: {
      id: 'overrideValve',
      title: 'Valve Position',
      value: 'Valve-CMD',
      unit: '%',
      color: '#ffc107',
    },

    controlSetpoint: {
      id: 'controlSetpoint',
      title: 'Control Setpoint',
      value: 'Valve-Temp-SP',
      unit: '°C',
      color: '#dc3545',
    },

    controlModeCWP: {
      id: 'controlModeCWP',
      title: 'Control Mode (Chilled Water Pump)',
      value: 'CWP-Control-Mode',
      unit: '',
      color: '#6610f2',
    },

    controlModeSAD: {
      id: 'controlModeSAD',
      title: 'Control Mode (Supply Air Damper)',
      value: 'SAD-Control-Mode',
      unit: '',
      color: '#0d6efd',
    },

    controlModeRAD: {
      id: 'controlModeRAD',
      title: 'Control Mode (Return Air Damper)',
      value: 'RAD-Control-Mode',
      unit: '',
      color: '#198754',
    },

    controlModeISOD: {
      id: 'controlModeISOD',
      title: 'Control Mode (ISO Damper)',
      value: 'ISOD-Control-Mode',
      unit: '',
      color: '#adb5bd',
    },

    controlModeFAD: {
      id: 'controlModeFAD',
      title: 'Control Mode (Fresh Air Damper)',
      value: 'FAD-Control-Mode',
      unit: '',
      color: '#0dcaf0',
    },

    overrideDamper: {
      id: 'overrideDamper',
      title: 'Override Damper',
      value: 'Override-FAD',
      unit: '',
      color: '#6c757d',
    },

    fadSetpoint: {
      id: 'fadSetfadSetpointpoint',
      title: 'FAD Setpoint',
      value: 'FAD-Temp-SP',
      unit: '%',
      color: '#ff6f61',
    },

    bypassSadMode: {
      id: 'bypassSadMode',
      title: 'ISOD Supply Control Mode',
      value: 'ISOD-Supply-Control-Mode',
      unit: '%',
      color: '#0ad2e9',
    },

    // bypassRadStatus: {
    //   id: 'bypassRadStatus',
    //   title: 'RAD Control Mode',
    //   value: 'RAD-Control-Mode', //TBC
    //   unit: '%',
    //   color: '#0ad2e9',
    // },

    damperControlMode: {
      id: 'damperControlMode',
      title: 'Damper Control Mode',
      value: 'Damper-Control-Mode',
      unit: '%',
      color: '#0ad2e9',
    },
  },
};
