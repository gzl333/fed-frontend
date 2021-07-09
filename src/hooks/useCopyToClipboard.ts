// 复制信息到剪切板的钩子函数
import { copyToClipboard, useQuasar } from 'quasar'

export default function () {
  const $q = useQuasar()
  // 调用useHook函数后对外暴露一个函数，这个函数内部包裹一个copyToClipboard的调用形式
  return (text: string) => {
    void copyToClipboard(text).then(() => {
      $q.notify({
        color: 'primary',
        message: `${text} 已经复制到剪切板`,
        // position: 'bottom-right',
        closeBtn: false,
        timeout: 1500
      })
    })
  }
}
