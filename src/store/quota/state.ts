export interface QuotaModuleInterface {
  prop: boolean;
}

function state (): QuotaModuleInterface {
  return {
    prop: false
  }
}

export default state
