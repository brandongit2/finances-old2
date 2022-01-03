import {forwardRef} from "react"

import type {SVGProps, Ref} from "react"

const Logo = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg viewBox="0 0 463 104" fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <style>{`
      @media (prefers-color-scheme:light) {
        #prefix__text {
          fill:#000
        }
      }

      @media (prefers-color-scheme:dark) {
        #prefix__text {
          fill:#fff
        }
      }
    `}</style>
    <path
      d="M151 62.202V21.441l-32.357 10.468 17.047 16.576L124.5 69l11.22 19.345L151 62.202Z"
      fill="url(#prefix__paint0_radial_2_2)"
    />
    <path
      d="M60.372 19.833c-19.549 0-37.902-9.178-37.902-9.178L0 34.024l28.788 48.335L135.7 48.475 151 21.44s-19.634-8.995-40.333-8.995c-20.7 0-30.746 7.388-50.295 7.388Z"
      fill="url(#prefix__paint1_linear_2_2)"
    />
    <path
      d="M0 73.964v-39.94s19.6 13.482 43.143 13.482 31.908-6.133 49.434-6.133c17.527 0 43.123 7.112 43.123 7.112l.02 39.86s-21.896-7.19-43.143-7.19c-18.949 0-25.891 6.291-49.434 6.291S0 73.964 0 73.964Z"
      fill="url(#prefix__paint2_radial_2_2)"
    />
    <path
      d="M188.296 43.88h4.176V31.64c0-3.696 1.032-6.6 3.096-8.712 2.112-2.16 5.232-3.24 9.36-3.24 2.448 0 4.392.432 5.832 1.296 1.488.816 2.616 1.584 3.384 2.304l-4.392 7.992c-.864-1.2-1.992-1.8-3.384-1.8-2.304 0-3.456 1.632-3.456 4.896v9.504h7.992v9h-7.992V77h-10.44V52.88h-4.176v-9Zm27.054-12.384c0-1.728.6-3.144 1.8-4.248 1.248-1.104 2.76-1.656 4.536-1.656 1.776 0 3.264.552 4.464 1.656 1.248 1.104 1.872 2.52 1.872 4.248 0 1.728-.624 3.144-1.872 4.248-1.2 1.056-2.688 1.584-4.464 1.584-1.776 0-3.288-.528-4.536-1.584-1.2-1.104-1.8-2.52-1.8-4.248Zm1.008 12.384h10.584V77h-10.584V43.88Zm41.066 12.96c0-1.968-.36-3.456-1.08-4.464-.72-1.056-1.968-1.584-3.744-1.584-1.728 0-3.12.528-4.176 1.584-1.056 1.008-1.584 2.496-1.584 4.464V77h-10.944V43.88h10.944v4.968c.96-1.824 2.256-3.24 3.888-4.248 1.68-1.008 3.744-1.512 6.192-1.512 4.128 0 7.128 1.104 9 3.312 1.92 2.208 2.88 5.304 2.88 9.288V77h-11.376V56.84Zm23.487-2.808-3.672-7.272c1.92-.912 4.176-1.776 6.768-2.592 2.64-.816 5.52-1.224 8.64-1.224 2.928 0 5.544.432 7.848 1.296 2.304.816 4.128 2.016 5.472 3.6 1.344 1.584 2.016 3.528 2.016 5.832V77h-10.44v-4.536c-1.008 1.728-2.52 3.048-4.536 3.96-1.968.864-4.104 1.296-6.408 1.296-2.112 0-4.08-.384-5.904-1.152a10.523 10.523 0 0 1-4.32-3.6c-1.056-1.584-1.584-3.504-1.584-5.76 0-3.168 1.104-5.664 3.312-7.488 2.256-1.872 5.472-2.808 9.648-2.808 2.016 0 3.864.216 5.544.648 1.68.384 3.096.864 4.248 1.44v-2.88c0-3.264-2.088-4.896-6.264-4.896-1.44 0-2.88.168-4.32.504-1.44.336-2.712.744-3.816 1.224-1.056.432-1.8.792-2.232 1.08Zm4.896 12.6c0 1.296.432 2.304 1.296 3.024.912.672 2.04 1.008 3.384 1.008 1.776 0 3.36-.528 4.752-1.584 1.392-1.104 2.16-2.736 2.304-4.896-1.968-.864-4.104-1.296-6.408-1.296-1.92 0-3.288.336-4.104 1.008-.816.624-1.224 1.536-1.224 2.736Zm51.844-9.792c0-1.968-.36-3.456-1.08-4.464-.72-1.056-1.968-1.584-3.744-1.584-1.728 0-3.12.528-4.176 1.584-1.056 1.008-1.584 2.496-1.584 4.464V77h-10.944V43.88h10.944v4.968c.96-1.824 2.256-3.24 3.888-4.248 1.68-1.008 3.744-1.512 6.192-1.512 4.128 0 7.128 1.104 9 3.312 1.92 2.208 2.88 5.304 2.88 9.288V77h-11.376V56.84Zm29.03 3.6c0 2.64.864 4.728 2.592 6.264 1.728 1.536 3.816 2.304 6.264 2.304 1.968 0 3.84-.408 5.616-1.224 1.776-.864 3.144-2.088 4.104-3.672v10.584c-1.152.912-2.592 1.656-4.32 2.232-1.728.528-3.84.792-6.336.792-3.696 0-6.984-.72-9.864-2.16-2.88-1.44-5.16-3.456-6.84-6.048-1.632-2.592-2.448-5.616-2.448-9.072 0-3.504.816-6.528 2.448-9.072 1.68-2.592 3.96-4.608 6.84-6.048 2.88-1.44 6.168-2.16 9.864-2.16 2.496 0 4.608.288 6.336.864 1.728.528 3.168 1.2 4.32 2.016v10.656c-.96-1.584-2.376-2.784-4.248-3.6-1.872-.816-3.696-1.224-5.472-1.224-1.632 0-3.12.384-4.464 1.152a8.526 8.526 0 0 0-3.24 3.024c-.768 1.296-1.152 2.76-1.152 4.392Zm43.284 17.28c-3.888 0-7.248-.696-10.08-2.088-2.784-1.44-4.944-3.456-6.48-6.048-1.536-2.592-2.304-5.64-2.304-9.144 0-5.376 1.656-9.6 4.968-12.672 3.312-3.072 7.872-4.608 13.68-4.608 5.712 0 10.104 1.464 13.176 4.392 3.12 2.928 4.68 7.056 4.68 12.384v1.512c0 .48-.024.912-.072 1.296h-25.272c.288 2.256 1.08 4.008 2.376 5.256 1.296 1.248 3 1.872 5.112 1.872 3.84 0 6.576-1.44 8.208-4.32l9.792 2.376c-3.504 6.528-9.432 9.792-17.784 9.792Zm-.432-27.288c-3.936 0-6.312 2.088-7.128 6.264h13.536c-.192-1.92-.864-3.432-2.016-4.536-1.104-1.152-2.568-1.728-4.392-1.728Zm26.585 14.544c2.544 2.112 4.704 3.552 6.48 4.32 1.824.72 3.312 1.08 4.464 1.08 2.16 0 3.24-.864 3.24-2.592 0-1.056-.504-1.896-1.512-2.52-1.008-.672-2.856-1.44-5.544-2.304a26.538 26.538 0 0 1-4.464-2.016 10.391 10.391 0 0 1-3.528-3.24c-.912-1.344-1.368-3.072-1.368-5.184 0-3.024 1.176-5.328 3.528-6.912 2.352-1.632 5.304-2.448 8.856-2.448 2.832 0 5.424.48 7.776 1.44 2.352.912 4.488 2.064 6.408 3.456l-3.888 7.128c-1.344-1.296-2.928-2.376-4.752-3.24-1.776-.864-3.408-1.296-4.896-1.296-.96 0-1.704.192-2.232.576-.48.384-.72.888-.72 1.512 0 1.104.648 1.92 1.944 2.448l5.688 2.232a30.93 30.93 0 0 1 4.752 2.16c1.44.816 2.592 1.848 3.456 3.096.912 1.248 1.368 2.904 1.368 4.968 0 3.504-1.08 6.168-3.24 7.992-2.16 1.824-5.232 2.736-9.216 2.736-3.6 0-6.792-.576-9.576-1.728-2.784-1.2-5.304-2.688-7.56-4.464l4.536-7.2Z"
      id="prefix__text"
    />
    <defs>
      <radialGradient
        id="prefix__paint0_radial_2_2"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(.79588 118.34932 -45.10838 .30335 137.133 -26.457)"
      >
        <stop offset={0.146} stopColor="#54F346" />
        <stop offset={0.59} stopColor="#60AE59" />
        <stop offset={0.885} stopColor="#2F662A" />
        <stop offset={1} stopColor="#214D1D" />
      </radialGradient>
      <radialGradient
        id="prefix__paint2_radial_2_2"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(88.01 41.296 37.715) scale(96.1493 189.099)"
      >
        <stop offset={0.146} stopColor="#54F346" />
        <stop offset={0.59} stopColor="#60AE59" />
        <stop offset={0.885} stopColor="#2F662A" />
        <stop offset={1} stopColor="#214D1D" />
      </radialGradient>
      <linearGradient
        id="prefix__paint1_linear_2_2"
        x1={19.5}
        y1={-11}
        x2={121.883}
        y2={68.9}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#73C166" />
        <stop offset={0.464} stopColor="#A7E988" />
        <stop offset={0.703} stopColor="#A7E988" />
        <stop offset={1} stopColor="#73C166" />
      </linearGradient>
    </defs>
  </svg>
)

const ForwardRef = forwardRef(Logo)
export default ForwardRef
