// The prefix "F" stands for "Finances", and is put there to distinguish from
// similarly named library types.

import type {DataFunctionArgs} from "@remix-run/server-runtime"

export type FLoaderFunction<T> = (args: DataFunctionArgs) => Promise<Response | T> | Response | T
