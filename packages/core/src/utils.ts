import fs from 'fs-extra'
import path from 'path'

export const isFunction = (arg: unknown): arg is (...args: any[]) => any =>
  typeof arg === 'function'

export const isBoolean = (arg: unknown): arg is boolean => {
  return typeof arg === 'boolean'
}

export const isObject = (arg: unknown): arg is boolean => {
  return typeof arg === 'object'
}

export const isNotFalse = (arg: unknown): arg is boolean => {
  return !(isBoolean(arg) && !arg)
}

export const isRegExp = (arg: unknown): arg is RegExp =>
  Object.prototype.toString.call(arg) === '[object RegExp]'

/*
 * Read all files in the specified folder, filter through regular rules, and return file path array
 * @param root Specify the folder path
 * [@param] reg Regular expression for filtering files, optional parameters
 * Note: It can also be deformed to check whether the file path conforms to regular rules. The path can be a folder or a file. The path that does not exist is also fault-tolerant.
 */
export function readAllFiles(root: string, reg?: RegExp) {
  let resultArr: string[] = []
  try {
    if (fs.existsSync(root)) {
      const stat = fs.lstatSync(root)
      if (stat.isDirectory()) {
        // dir
        const files = fs.readdirSync(root)
        files.forEach(function (file) {
          const t = readAllFiles(path.join(root, '/', file), reg)
          resultArr = resultArr.concat(t)
        })
      } else {
        if (reg !== undefined) {
          if (isFunction(reg.test) && reg.test(root)) {
            resultArr.push(root)
          }
        } else {
          resultArr.push(root)
        }
      }
    }
  } catch (error) {
    console.log(error)
  }

  return resultArr
}
