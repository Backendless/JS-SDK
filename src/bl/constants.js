export const EXECUTION_TYPE_HEADER = 'bl-execution-type'

export const ExecutionTypes = {
  SYNC              : 'sync',
  ASYNC             : 'async',
  ASYNC_LOW_PRIORITY: 'async-low-priority'
}

const executionTypesList = Object.keys(ExecutionTypes).map(k => ExecutionTypes[k])

export const isExecutionType = type => executionTypesList.includes(type)
