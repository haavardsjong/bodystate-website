# Content Editing Guide

This directory contains markdown files for easy editing of website content.

## Files

- `faq.md` - Frequently Asked Questions content
- `privacy-policy.md` - Privacy Policy content

## How to Edit

1. **Edit the markdown files** using any text editor
   - Use standard markdown formatting
   - For FAQ: Use `##` for sections, `###` for questions
   - For Privacy: Use standard heading levels and lists

2. **Sync your changes** to the website:
   ```bash
   npm run content:sync
   ```

3. **Translate to other languages** (optional):
   ```bash
   npm run translate
   ```

4. **Check translation status**:
   ```bash
   npm run translation:status
   ```

## FAQ Structure

```markdown
## Section Name

### Question goes here?

Answer paragraph 1.

Answer paragraph 2.

- List item 1
- List item 2

#### Subheading (optional)

More content...

1. Step 1
2. Step 2
```

## Privacy Policy Structure

Standard markdown with:
- `#` for main title
- `##` for major sections
- `###` for subsections
- `-` for bullet lists
- Regular paragraphs for content

## Important Notes

- Always run `npm run content:sync` after editing
- The sync script converts markdown to JSON format
- Changes only affect the English version initially
- Run `npm run translate` to update other languages
- Test your changes locally with `npm run dev`