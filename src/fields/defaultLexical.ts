import type { TextFieldSingleValidation } from 'payload'
import {
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  lexicalEditor,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
  type LinkFields,
} from '@payloadcms/richtext-lexical'

const linkFeature = LinkFeature({
  enabledCollections: ['pages', 'posts', 'events'],
  fields: ({ defaultFields }) => {
    const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
      if ('name' in field && field.name === 'url') return false
      return true
    })

    return [
      ...defaultFieldsWithoutUrl,
      {
        name: 'url',
        type: 'text',
        admin: {
          condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
        },
        label: ({ t }) => t('fields:enterURL'),
        required: true,
        validate: ((value, options) => {
          if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
            return true // no validation needed, as no url should exist for internal links
          }
          return value ? true : 'URL is required'
        }) as TextFieldSingleValidation,
      },
    ]
  },
})

const baseTextFeatures = [
  ParagraphFeature(),
  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
  UnorderedListFeature(),
  OrderedListFeature(),
  BlockquoteFeature(),
  BoldFeature(),
  ItalicFeature(),
  UnderlineFeature(),
  StrikethroughFeature(),
  InlineCodeFeature(),
  linkFeature,
]

export const defaultLexical = lexicalEditor({
  features: [...baseTextFeatures, FixedToolbarFeature(), InlineToolbarFeature()],
})

/** Editor completo per descrizioni evento. */
export const eventDescriptionLexical = lexicalEditor({
  features: [
    ...baseTextFeatures,
    HorizontalRuleFeature(),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})
