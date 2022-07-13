/*
 * @Description:
 * @Date: 2021-09-14 18:12:33
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    amd: true,
    'vue/setup-compiler-macros': true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true
    }
    // "project": "./tsconfig.json"
  },
  plugins: ['vue', '@typescript-eslint/eslint-plugin', 'prettier'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
  rules: {
    '@typescript-eslint/no-var-requires': 'off', // require报错提示
    '@typescript-eslint/no-explicit-any': 'off', // any类型的警告
    '@typescript-eslint/ban-types': 'off', // 检查默认的禁令类型
    '@typescript-eslint/no-this-alias': 'off', // 防止this变量和局部变量混淆
    '@typescript-eslint/explicit-module-boundary-types': 'off', // ts每个函数都要显式声明返回值
    '@typescript-eslint/no-unused-vars': 'off', // 检查未使用变量名
    'no-console': 0,
    'no-debugger': 0,
    semi: [0],
    'no-unused-vars': [
      0,
      {
        // 允许声明未使用变量
        vars: 'local',
        // 参数不检查
        args: 'none'
      }
    ],
    eqeqeq: ['error', 'always', { null: 'ignore' }], // 强制使用全等
    'vue/no-unused-vars': 0,
    'vue/no-unused-components': 0,
    'prettier/prettier': [
      'error',
      {
        printWidth: 120, // 超过最大值换行
        tabWidth: 2, // 缩进字节数
        useTabs: false, // 缩进不使用tab，使用空格
        semi: false, // 句尾添加分号
        singleQuote: true, // 使用单引号代替双引号
        proseWrap: 'preserve', // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
        arrowParens: 'avoid', //  箭头函数参数只有一个时是否要有小括号。avoid：省略括号
        bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
        disableLanguages: ['vue'], // 不格式化vue文件，vue文件的格式化单独设置
        endOfLine: 'auto', // 结尾是 \n \r \n\r auto
        eslintIntegration: false, //不让prettier使用eslint的代码格式进行校验
        htmlWhitespaceSensitivity: 'ignore',
        ignorePath: '.prettierignore', // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
        requireConfig: false, // Require a 'prettierconfig' to format prettier
        stylelintIntegration: false, //不让prettier使用stylelint的代码格式进行校验
        trailingComma: 'none', // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
        tslintIntegration: false // 不让prettier使用tslint的代码格式进行校验
      }
    ]
  },
  globals: {
    Message: true
  }
}
