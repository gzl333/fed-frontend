export interface ServerModuleInterface {
  prop: boolean;
}

function state (): ServerModuleInterface {
  return {
    prop: false
  }
}

export default state
