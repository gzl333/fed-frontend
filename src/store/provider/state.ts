export interface ProviderModuleInterface {
  prop: boolean;
}

function state (): ProviderModuleInterface {
  return {
    prop: false
  }
}

export default state
