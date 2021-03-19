// 复制信息到剪切板
import { copyToClipboard, useQuasar } from 'quasar'

const useCopyToClipboard = (text: string) => {
  const $q = useQuasar()
  void copyToClipboard(text).then(() => {
    console.log($q)
    $q.notify({
      color: 'primary',
      message: `${text} 已经复制到剪切板`,
      // position: 'bottom-right',
      closeBtn: false,
      timeout: 1500
    })
  })
}

export default useCopyToClipboard
