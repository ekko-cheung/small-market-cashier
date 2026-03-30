import initBills from './bills'
import initGoods from './goods'
import initPayments from './payment'

export function initIPCMain() {
  initGoods()
  initBills()
  initPayments()
}
