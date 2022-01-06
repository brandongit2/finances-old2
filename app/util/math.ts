import type {TupleOf} from "~/types/TupleOf"

export type Matrix<NRows extends number, NCols extends number> = TupleOf<TupleOf<number, NCols>, NRows>
export type Vector<Length extends number> = TupleOf<[number], Length>

// Make creating matrices and vectors look better
export const mat = <NRows extends number, NCols extends number>(...rows: Matrix<NRows, NCols>): Matrix<NRows, NCols> =>
  rows as Matrix<NRows, NCols>
export const vec = <Length extends number>(...elements: TupleOf<number, Length>): Vector<Length> =>
  elements.map((element) => [element]) as Vector<Length>

export const avg = (a: number, b: number): number => (a + b) / 2

// Adapted from https://stackoverflow.com/a/27205510/3944900
export const matMul = <Matrix1 extends Matrix<any, any>, Matrix2 extends Matrix<any, any>>(
  mat1: Matrix1,
  mat2: Matrix2,
): Matrix<Matrix1[`length`], Matrix2[number][`length`]> => {
  let result: number[][] = []
  for (let i = 0; i < mat1.length; i++) {
    result[i] = []
    for (let j = 0; j < mat2[0].length; j++) {
      let sum = 0
      for (let k = 0; k < mat1[0].length; k++) {
        sum += mat1[i][k] * mat2[k][j]
      }
      result[i][j] = sum
    }
  }
  return result as Matrix<Matrix1[number][`length`], Matrix2[`length`]>
}

// 2D matrix math
export const genTransformMatrix = (dx: number, dy: number): Matrix<3, 3> => [
  [1, 0, dx],
  [0, 1, dy],
  [0, 0, 1],
]

export const genScaleMatrix = (originX: number, originY: number, factor: number): Matrix<3, 3> => {
  const transform1 = genTransformMatrix(-originX, -originY)
  const transform2 = genTransformMatrix(originX, originY)
  const scale: Matrix<3, 3> = [
    [factor, 0, 0],
    [0, factor, 0],
    [0, 0, 1],
  ]

  return matMul(transform2, matMul(scale, transform1))
}
