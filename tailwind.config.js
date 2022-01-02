const plugin = require(`tailwindcss/plugin`)

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  content: [`./app/**/*.tsx`],
  theme: {
    colors: {
      grass: {
        1: `var(--grass1)`,
        2: `var(--grass2)`,
        3: `var(--grass3)`,
        4: `var(--grass4)`,
        5: `var(--grass5)`,
        6: `var(--grass6)`,
        7: `var(--grass7)`,
        8: `var(--grass8)`,
        9: `var(--grass9)`,
        10: `var(--grass10)`,
        11: `var(--grass11)`,
        12: `var(--grass12)`,
      },
      grassA: {
        1: `var(--grassA1)`,
        2: `var(--grassA2)`,
        3: `var(--grassA3)`,
        4: `var(--grassA4)`,
        5: `var(--grassA5)`,
        6: `var(--grassA6)`,
        7: `var(--grassA7)`,
        8: `var(--grassA8)`,
        9: `var(--grassA9)`,
        10: `var(--grassA10)`,
        11: `var(--grassA11)`,
        12: `var(--grassA12)`,
      },
      olive: {
        1: `var(--olive1)`,
        2: `var(--olive2)`,
        3: `var(--olive3)`,
        4: `var(--olive4)`,
        5: `var(--olive5)`,
        6: `var(--olive6)`,
        7: `var(--olive7)`,
        8: `var(--olive8)`,
        9: `var(--olive9)`,
        10: `var(--olive10)`,
        11: `var(--olive11)`,
        12: `var(--olive12)`,
      },
      oliveA: {
        1: `var(--oliveA1)`,
        2: `var(--oliveA2)`,
        3: `var(--oliveA3)`,
        4: `var(--oliveA4)`,
        5: `var(--oliveA5)`,
        6: `var(--oliveA6)`,
        7: `var(--oliveA7)`,
        8: `var(--oliveA8)`,
        9: `var(--oliveA9)`,
        10: `var(--oliveA10)`,
        11: `var(--oliveA11)`,
        12: `var(--oliveA12)`,
      },
      error: `var(--error)`,
    },
    fontFamily: {
      sans: [`Public Sans`, `sans-serif`],
    },
  },
  plugins: [
    plugin(({addUtilities, addVariant}) => {
      addVariant(`children`, `& > *`)

      addVariant(`radix-open`, `&[data-state="open"]`)
      addVariant(`radix-closed`, `&[data-state="closed"]`)
      addVariant(`radix-visible`, `&[data-state="visible"]`)
      addVariant(`radix-hidden`, `&[data-state="hidden"]`)
      addVariant(`radix-checked`, `&[data-state="checked"]`)
      addVariant(`radix-unchecked`, `&[data-state="unchecked"]`)

      addUtilities({
        ".hard-center": {
          position: `absolute`,
          left: `50%`,
          top: `50%`,
          transform: `translate(-50%, -50%)`,
        },

        ".increase-touch-target": {
          "&::before": {
            content: `""`,
            position: `absolute`,
            top: `50%`,
            left: `50%`,
            transform: `translate(-50%, -50%)`,
            width: `100%`,
            height: `100%`,
            minWidth: `32px`,
            minHeight: `32px`,
          },
        },
      })
    }),
  ],
}
