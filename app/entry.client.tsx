import "core-js/features/array/at" // For Safari 15
import {hydrate} from "react-dom"
import {RemixBrowser} from "remix"

hydrate(<RemixBrowser />, document)
