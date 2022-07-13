/*
 * @Description:
 * @Date: 2021-09-14 17:53:36
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
