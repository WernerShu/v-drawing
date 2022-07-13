;(function (win) {
  let tid: null | ReturnType<typeof setTimeout> = null
  function refreshRem(): void {
    const designSize = 1920 // 设计图尺寸
    const html = document.documentElement
    const wW = html.clientWidth // 窗口宽度
    const rem = (wW * 10) / designSize
    document.documentElement.style.fontSize = rem + 'px'
  }

  win.addEventListener(
    'resize',
    function (): void {
      clearTimeout(tid)
      tid = setTimeout(refreshRem, 300)
    },
    false
  )
  win.addEventListener(
    'pageshow',
    function (e): void {
      if (e.persisted) {
        clearTimeout(tid)
        tid = setTimeout(refreshRem, 300)
      }
    },
    false
  )

  refreshRem()
})(window)
