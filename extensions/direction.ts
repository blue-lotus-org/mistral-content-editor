import { Extension } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    direction: {
      /**
       * Set the text direction
       */
      setDirection: (direction: "ltr" | "rtl") => ReturnType
    }
  }
}

export interface DirectionOptions {
  types: string[]
  defaultDirection: "ltr" | "rtl"
}

export const Direction = Extension.create<DirectionOptions>({
  name: "direction",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      defaultDirection: "ltr",
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          dir: {
            default: this.options.defaultDirection,
            parseHTML: (element) => element.dir || this.options.defaultDirection,
            renderHTML: (attributes) => {
              if (attributes.dir === this.options.defaultDirection) {
                return {}
              }

              return { dir: attributes.dir }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setDirection:
        (direction) =>
        ({ commands }) => {
          return this.options.types.every((type) => commands.updateAttributes(type, { dir: direction }))
        },
    }
  },
})

export default Direction

