import path from 'path'
/**
 * 格式化env
 */
export function wrapperEnv(envConf: Recordable): ViteEnv {
  const ret: any = {}
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    // 如果是boolean类型就转换
    realName = realName === 'true' ? true : realName === 'false' ? false : realName
    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }
    if (envName === 'VITE_PROXY' && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'))
      } catch (error) {
        realName = ''
      }
    }
    ret[envName] = realName
    if (typeof realName === 'string') {
      process.env[envName] = realName
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName)
    }
  }
  return ret
}
/**
 * 获取用户根目录
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir)
}
/**
 * 返回 当前项目下的绝对路径
 * @param dir 路径-相对
 */
export function pathResolve(dir: string) {
  // 栗子:path.resolve('/foo/bar','.','/tmp/file')
  // /foo/bar/temp/file
  return path.resolve(process.cwd(), '.', dir)
}
