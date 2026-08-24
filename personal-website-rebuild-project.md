# Personal Website Rebuild Project 

## Context

Swasti's personal site (swasti-mishra.com) is due for an update. It currently exists, but is stale and worth refreshing as she re-enters the job market. This is also being used deliberately as a skill-building project: to build real, demonstrable React/Next.js and CMS experience ahead of applying to frontend engineering roles. The original prompt was a Front End Engineer, Marketing posting at Anthropic that required Next.js and headless CMS experience she didn't yet have.

The existing repo for the project is here: /Users/gutenberg2.0/Documents/GitHub/swasti-mishra

**Goal:** rebuild the site using the specific tools named as gaps, so future applications can point to real, shipped work rather than claimed familiarity.

## Current state

- Live at swasti-mishra.com  
- Built in vanilla HTML/CSS/JS, no framework  
- Existing pages:  
  - Home: Simple landing with links to three sections  
  - `Coding.html`: Graphics/JS projects, including a "disco fish" pure-JS canvas piece, and links out to GitHub (github.com/pixelatinate) and to ccc19.org  
  - `Writing.html`: Collected articles/writing samples  
  - `Illustration.html`: Personal artwork  
- Other relevant prior work (for context/inspiration, not migration targets):   
  - [ccc19.org](http://ccc19.org): Built by Swasti. It’s a multi-page site for a 120+ institution medical consortium, and it used the Altmetric API.   
  - CatalogVisualizer: Located at [github.com/jmandzak/CatalogVisualizer](http://github.com/jmandzak/CatalogVisualizer), and collaborated with another student to use jQuery \+ webpack, and create a course catalog data viz tool.   
  - These pages/projects should probably be linked to on her new website. 

## Target stack

- **Next.js** (React-based): This is the specific named gap to close.  
- **CSS**: Should include at least one section with genuinely complex layout/animation work, not just utility classes, since "CSS at a level that lets you implement complex layouts, animations, and interactive experiences with precision" was explicitly named in the job posting that prompted this.  
- **Headless CMS**: Pick one (Contentful, Sanity, and Notion-as-CMS are all reasonable, low-friction choices) and use it for at least the writing/blog section, so there's real experience with content modeling and structured data workflows, not just a static rebuild.

## Suggested approach

1. **Scaffold in [Next.js](http://Next.js)**. Rebuild the existing site structure first, 1:1, before adding new capability. Gets the framework fundamentals down without also solving new design problems at the same time.  
2. **Migrate `writing.html` to a CMS-backed blog**. This is the highest-value single change. Pull posts from a headless CMS instead of hardcoded HTML, so there's a real content-modeling story to talk about in terms of fields, publishing workflow, etc. Also, the pages I wrote in the MATLAB 2026a release and the pages I wrote at Databricks should be included. We can do this in a second phase, but it would be a good idea to go through and internet archive of the versions I wrote and link to both those and the live versions of the page. Maybe we can also build some sort of tooling to handle when those links get broken, and add it to my GitHub as a separate project? Not sure.   
3. **Rebuild "disco fish" as a React component**. Good, contained way to practice component state/lifecycle without a large surface area, and preserves something already personally meaningful on the site.  
4. **Add one genuinely complex interactive/animated piece**. A data visualization or interactive element (candidates: a viz of something like the CatalogVisualizer data, or an interactive illustration piece) to directly demonstrate the "interactive pages, data visualizations, and tools that communicate complex information clearly" bullet.  
5. **Update location/biographical information.** The text across the site should be updated to reflect that Swasti has moved from Nashville, to Knoxville, to Boston, and then to Seattle.   
6. **Add other work to coding.html.** The info about her GitHub should be updated to explain that a lot of her prior coursework is there, and that the lack of commit activity is mostly related to doing a lot of coding at work, which is not reflected. Also we can add more visual emphasis to the [ccc19.org](http://ccc19.org) link, and we should link to the catalog visualizer project as well.   
7. **Update illustration.html to include newer work.** I’m not sure what the best web architecture format is for this page, but I’ve drawn lots of work I’m proud of here: [https://www.tumblr.com/blog/pixelatinate](https://www.tumblr.com/blog/pixelatinate) As a second phase, we can choose which pieces to include on the website and how they should be arranged/uploaded. 

## Things to preserve

- The overall tone/voice of the site. Casual, personal, not corporate.  
- The existing sections (coding, writing, illustration) structure works, just needs modernizing.  
- Links out to CCC19 and GitHub. 

## Open questions for the next session

- Preferred CMS? (Recommend starting with something low-setup like Sanity or Notion-as-CMS unless there's a reason to prefer Contentful).  
- Deploy target: Currently unclear if it's GitHub Pages; Next.js will need Vercel, Netlify, or similar if so.  
- Timeline: This is a “get something shippable fast" project.