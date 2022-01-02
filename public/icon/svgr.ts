/*
 * Take an SVG file and transform it into a React component. The component is written to ~/app/components/icons.
 * To use, run:
 * node --require esbuild-register <pathToThisScript> <pathToSvgFile>
 * This works as long as you're inside the Node project folder.
 */

import {transform} from "@svgr/core"
import {pascalCase} from "change-case"
import fs from "fs"
import path from "path"

const filePath = process.argv[2]
const file = fs.readFileSync(path.resolve(process.cwd(), filePath)).toString()

const componentName = pascalCase(filePath.split(`/`).at(-1)!.replace(`.svg`, ``)) + `Icon`
const component = transform.sync(
  file,
  {
    dimensions: false,
    expandProps: `end`,
    jsxRuntime: `automatic`,
    plugins: [`@svgr/plugin-svgo`, `@svgr/plugin-jsx`, `@svgr/plugin-prettier`],
    ref: true,
    typescript: true,
  },
  {componentName},
)

fs.writeFileSync(path.resolve(__dirname, `..`, `..`, `app`, `components`, `icons`, componentName + `.tsx`), component)
