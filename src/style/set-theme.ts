// 修改主题
const body = document.getElementsByTagName('body')[0]
const theme1 = {
  '--primary-color': '#409EFF',
  '--error-color': '#F56C6C',
  '--warning-color': '#E6A23C',
  '--success-color': '#67C23A',
  '--info-color': '#909399'
}
function setTheme(url?: string) {
  const theme = theme1
  // if (useRouteStore().client === 'rural') {
  //   theme = theme2
  // }
  for (const style in theme) {
    body.style.setProperty(`${style}`, theme[style])
  }
}

export default setTheme
