/*
 * @Description:获取头部title
 * @Date: 2022-01-07 10:56:58
 */
const title = 'drawing'
const getTitle = function (til: string): string {
  const allTitle = til + '-' + title
  return allTitle
}
export default getTitle
