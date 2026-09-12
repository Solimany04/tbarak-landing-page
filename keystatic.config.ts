import { config, fields, collection } from '@keystatic/core';
import { compressedImage } from '@/lib/keystatic/compressed-image';

const isGithub = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === 'github';

export default config({
  storage: isGithub
    ? { kind: 'github', repo: { owner: 'Solimany04', name: 'tbarak-landing-page' } }
    : { kind: 'local' },
  ui: { brand: { name: 'لوحة التحكم' } },
  collections: {
    products: collection({
      label: 'Products',
      slugField: 'slug',
      path: 'content/products/*',
      format: { data: 'json' },
      schema: {
        slug: fields.slug({
          name: { label: 'Slug (shared across locales)', validation: { length: { max: 60 } } },
        }),
        // validation.length.max = character limit enforced in the admin UI
        titleAr: fields.text({ label: 'Title (Arabic)', validation: { length: { max: 60 }} }),
        titleEn: fields.text({ label: 'Title (English)', validation: { length: { max: 60 }  } }),
        descAr: fields.text({
          label: 'Description (Arabic)',
          multiline: true,
          validation: { length: { max: 300 } },
        }),
        descEn: fields.text({
          label: 'Description (English)',
          multiline: true,
          validation: { length: { max: 300 } },
        }),
        // Same stored shape as fields.image (`/Products/<slug>/images/<n>.<ext>`),
        // but uploads are resized to ≤1570px, converted to WebP and rejected if
        // still over 1 MB — all in the browser (see lib/keystatic/compressed-image.tsx).
        images: fields.array(
          compressedImage({
            label: 'Image',
            directory: 'public/Products',
            publicPath: '/Products',
            description: 'Resized to 1570px max and converted to WebP on upload. Must be under 1 MB after compression.',
          }),
          { label: 'Images', itemLabel: (p) => p.value?.filename ?? 'Image' }
        ),
      },
    }),
    feedbacks: collection({
      label: 'Feedbacks',
      slugField: 'slug',
      path: 'content/feedbacks/*',
      format: { data: 'json' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug', validation: { length: { max: 60 } } } }),
        nameAr: fields.text({ label: 'Name (Arabic)', validation: { length: { max: 50 } } }),
        nameEn: fields.text({ label: 'Name (English)', validation: { length: { max: 50 } } }),
        roleAr: fields.text({ label: 'Role (Arabic)', validation: { length: { max: 60 } } }),
        roleEn: fields.text({ label: 'Role (English)', validation: { length: { max: 60 } } }),
        contentAr: fields.text({
          label: 'Content (Arabic)',
          multiline: true,
          validation: { length: { max: 400 } },
        }),
        contentEn: fields.text({
          label: 'Content (English)',
          multiline: true,
          validation: { length: { max: 400 } },
        }),
      },
    }),
  },
});
