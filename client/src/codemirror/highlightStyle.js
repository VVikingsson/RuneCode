import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

export const myHighlightStyle = HighlightStyle.define([
  { tag: tags.name, color: "#F2F2F2" },

  { tag: tags.comment, color: "#9E9E9E", fontStyle: "italic" },
  { tag: tags.lineComment, color: "#9E9E9E", fontStyle: "italic" },
  { tag: tags.blockComment, color: "#9E9E9E", fontStyle: "italic" },
  { tag: tags.docComment, color: "#A8D1A8", fontStyle: "italic" },

  { tag: tags.keyword, color: "#C792EA" },
  { tag: tags.self, color: "#C792EA" },
  { tag: tags.null, color: "#C792EA" },
  { tag: tags.atom, color: "#C792EA" },
  { tag: tags.controlKeyword, color: "#FF5370" },
  { tag: tags.definitionKeyword, color: "#C792EA" },
  { tag: tags.moduleKeyword, color: "#C792EA" },

  { tag: tags.operator, color: "#FF9F00" },
  { tag: tags.operatorKeyword, color: "#C792EA" },
  { tag: tags.definitionOperator, color: "#FF9F00" },
  { tag: tags.compareOperator, color: "#FF9F00" },
  { tag: tags.arithmeticOperator, color: "#FF9F00" },

  { tag: tags.punctuation, color: "#B3B3B3" },
  { tag: tags.separator, color: "#B3B3B3" },

  { tag: tags.bracket, color: "#F2F2F2" },
  { tag: tags.paren, color: "#F2F2F2" },
  { tag: tags.brace, color: "#F2F2F2" },
  { tag: tags.squareBracket, color: "#F2F2F2" },

  { tag: tags.literal, color: "#FFCB6B" },
  { tag: tags.string, color: "#C3E88D" },
  { tag: tags.docString, color: "#80C280" },
  { tag: tags.escape, color: "#FF5370" },
  { tag: tags.number, color: "#F78C6C" },
  { tag: tags.integer, color: "#F78C6C" },
  { tag: tags.float, color: "#F78C6C" },
  { tag: tags.bool, color: "#C792EA" },

  { tag: tags.variableName, color: "#80CBC4" },
  { tag: tags.definition(tags.variableName), color: "#F2F2F2" },
  { tag: tags.function(tags.variableName), color: "#82AAFF" },
  { tag: tags.function(tags.propertyName), color: "#82AAFF" },
  { tag: tags.propertyName, color: "#F2F2F2" },

  { tag: tags.className, color: "#FFCB6B" },
  { tag: tags.typeName, color: "#FFCB6B" },

  { tag: tags.invalid, color: "#FF5370", textDecoration: "underline" },
  { tag: tags.meta, color: "#80CBC4" }
])

export const myHighlightExtension = syntaxHighlighting(myHighlightStyle)
