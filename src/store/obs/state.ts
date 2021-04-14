export interface ObsStateInterface {
  prop: boolean;
}

function state (): ObsStateInterface {
  return {
    prop: false
  }
}

export default state
