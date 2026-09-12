# Sustainomics CMS Quick Guide

This is a simple guide for adding and managing content in the EmDash dashboard.

## Open the dashboard

Local development:

```bash
npx emdash dev
```

Then open `/_emdash/admin` on the port printed by the dev server.

Production:

<https://thesustainomics.com/_emdash/admin>

Use the production admin account created at `/_emdash/admin/setup`. Do not commit development URLs, emails, or passwordless credentials.

## Dashboard options

### Content

| Option | What it is for |
| --- | --- |
| Advertisements | Add and manage site advertisements |
| Articles | Add articles that belong to magazine issues |
| Magazine | Add magazine covers, PDFs, and issue details |
| Pages | Add general pages such as About |
| Podcast | Add podcast episodes, audio, and show notes |
| Posts | Add news, analysis, and opinion posts |
| Video | Add YouTube videos and video details |
| Media | Upload and manage images, PDFs, and audio files |

### Site management

| Option | What it is for |
| --- | --- |
| Comments | Approve, reject, or delete comments |
| Menus | Change the site's navigation links |
| Redirects | Send old URLs to new URLs and view 404 errors |
| Widgets | Manage sidebar and footer blocks |
| Sections | Create reusable content sections |
| Categories | Manage main topics such as Climate, Markets, and Opinion |
| Tags | Manage smaller topic labels |
| Bylines | Manage the author names shown on articles and posts |

### Administration

| Option | What it is for |
| --- | --- |
| Content Types | Change the fields available for Posts, Videos, and other content |
| Users | Invite users and manage their roles |
| Plugins | Enable or disable dashboard features |
| Import | Import content from WordPress |
| Settings | Change the site title, SEO, social links, security, email, and API tokens |
| Audit History | View a history of content changes |

## How to publish a post

1. Open **Posts** from the left menu.
2. Select **Add New**.
3. Enter the **Title**.
4. Select a **Featured Image**.
5. Write the article in **Content**.
6. Add a short **Excerpt**.
7. Set a clean **Slug** in the right panel. This becomes the page URL.
8. Select the author under **Bylines**.
9. Select at least one **Category**.
10. Add any useful **Tags**.
11. Add SEO details if needed.
12. Save the post and use **Live View** to check it.
13. Select **Publish** when it is ready.
14. Use **View** to check the published page.

Saving a post does not necessarily publish it. Check that its status says **Published**.

## How to upload media

1. Open **Media** from the left menu.
2. Select **Upload to Library**.
3. Choose an image, PDF, or audio file from your device.
4. Wait until the upload is complete.
5. Open the uploaded item and add alternative text or a caption when needed.
6. Return to the Post, Article, Magazine, Podcast, or Video editor.
7. Select the uploaded file in the appropriate media field.
8. Publish the content and check that the file displays or downloads correctly.

Upload a file to Media before trying to select it in a content entry.

## How to publish an Opinion post

Opinion stories are created under **Posts**, not Articles.

1. Follow the normal Post steps.
2. Select the **Opinion** category.
3. Enter one of these exact values in **Opinion Series Slug**:

   - `the-sustainomics-show`
   - `founder-stories`
   - `global-alliances`
   - `women-in-lead`
   - `market-daily`
   - `tech-horizons`
   - `green-economy`
   - `policy-watch`
   - `capital-chronicles`
   - `esg-watch`

4. Publish the post.
5. Check the post on `/opinion` and under the selected series.

## How to control the home page

Use the **Homepage Slot** field on a Post.

| Value | Placement |
| --- | --- |
| `lead` | Main lead story |
| `secondary` | Secondary headline |
| `feature` | Featured story |
| `standard` | Normal home-page story |
| `hidden` | Do not use in the normal home-page news layout |
| Leave empty | Let the site choose by publication date |

Enter these values exactly as shown, using lowercase letters.

## How to add a magazine issue

1. Upload the cover image and PDF under **Media**.
2. Open **Magazine**.
3. Select **Add New**.
4. Enter the title and issue date.
5. Select the cover and PDF.
6. Add a short description.
7. Publish and test the magazine page and PDF link.

## How to add a magazine article

1. Make sure the magazine issue already exists.
2. Open **Articles** and select **Add New**.
3. Add the title, image, excerpt, and content.
4. Select the correct magazine under **Issue**.
5. Add the Magazine Section and Read Time if needed.
6. Publish and check the article page.

## How to add a podcast

1. Upload the artwork and audio under **Media**.
2. Open **Podcast** and select **Add New**.
3. Add the title, summary, and show notes.
4. Select the artwork and audio.
5. Add the episode date and duration.
6. Add a YouTube or Spotify/Apple URL if available.
7. Publish and test the player.

## How to add a video

1. Open **Video** and select **Add New**.
2. Add the title and description.
3. Paste the YouTube URL.
4. Select a thumbnail if needed.
5. Add the video category, date, and duration.
6. Publish and check the `/video/[slug]` page.

## How to insert YouTube into a post or article

1. Open a Post or Article.
2. Place the cursor where the video should appear.
3. Insert the **YouTube Video** content block.
4. Paste the YouTube URL.
5. Add an accessible title describing the video.
6. Save, preview, and publish.

## How to add an advertisement

1. Upload the ad image under **Media** if necessary.
2. Open **Advertisements** and select **Add New**.
3. Enter an internal ad name.
4. Select the image and add the click URL.
5. Enter the required Placement, such as `leaderboard`, `sidebar`, `homepage`, `article`, or `mid-page`.
6. Add the sponsor label.
7. Publish to activate the advertisement.
8. Unpublish or save as Draft to pause it.

## How to edit, copy, or remove content

On a collection list, use the icons at the right of each entry:

- **View** opens the public page.
- **Edit** opens the editor.
- **Duplicate** creates a copy.
- **Trash** removes the item from the normal list.

Use the **Trash** tab to manage deleted entries. Use **Unpublish** when an item should remain in the CMS but should no longer be public.

## How to manage categories, tags, and authors

- Open **Categories** to add or rename main sections.
- Open **Tags** to add or rename smaller topics.
- Open **Bylines** to add the public name, slug, biography, and website for an author.

A Byline is the name shown publicly. A User is an account that can sign in to the dashboard.

## How to manage the navigation menu

1. Open **Menus**.
2. Open **Primary Navigation**.
3. Add, remove, or reorder links.
4. Save the menu.
5. Check both the desktop and mobile site navigation.

## Quick checklist before publishing

- Title and slug are correct.
- Featured image or media is selected.
- Excerpt is filled in.
- Author is selected.
- Category and tags are correct.
- Links work.
- SEO details are correct when required.
- Live View looks correct.
- Status says Published.
- The public page opens successfully.

## Fixes already made

- Added the Opinion Series Slug field to Posts.
- Added the Homepage Slot field to Posts.
- Corrected Opinion pages to use Posts and the correct post links.
- Added Opinion series filtering.
- Added internal video detail pages.
- Added YouTube blocks for Posts and Articles.
- Improved advertisement rotation and image handling.
- Improved media registration for bundled files.
- Added protection against accidentally replacing production data with seed content.

## Items still to complete

- Homepage Slot is currently empty on all Posts.
- Opinion Series Slug is currently empty on all six Opinion posts.
- One Podcast references a missing file: `podcast-sample-15s.mp3`.
- Audit History is not recording changes because of a plugin capability problem.
- The project type check currently reports errors that still need to be fixed.
