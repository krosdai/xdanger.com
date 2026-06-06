# 将博客从 Next.js 迁移到 Astro

步骤：

## ✅ 清除 Next.js 相关配置

- 删除本地所有和 Next.js 相关的文件
- 删除本地 `node_modules`, `.next`, `.out` 等目录

## ✅ 创建空白 Astro 项目

- 在其他目录使用 [cactus](https://github.com/chrismwilliams/astro-theme-cactus) 模版新起一个空白 Astro 项目

  ```bash
  bun create astro@latest -- --template chrismwilliams/astro-theme-cactus
  bun install
  ```

- 确保可以正常运行

## ✅ 修改 URL 路由

所有页面：

- 为了 URL 更简洁现代，不要以 `/` 结尾
- 同时为了 SEO 向后兼容，页面都要支持 `.html` 结尾来访问（但不是正式 URL）
- 为了保持博客之前 URL 的路径，需要去掉 `/posts` 前缀
  这个路由的优先级应为最低：仅当其他路径策略都没找到相应应该显示的页面内容后，才在 `src/content/post` 里找有没有对应的 markdown 文件，如果也没有再显示 404 页面 —— 优先级仅在 404 页面之前。目前来说，路由优先级应当为：
  - `src/pages/` 目录下的 `.astro` 文件
  - `src/content/note/` 目录下的 `.mdx`, `.md` 文件
  - `src/content/post/` 目录下的 `.mdx`, `.md` 文件

例如：

- `src/pages/about.astro`：URL 为 `/about`，也支持 `/about.html`
- `src/content/note/welcome.mdx`：URL 为 `/notes/welcome`，也支持 `/notes/welcome.html`
- `src/content/post/testing/long-title.mdx`：URL 为 `/testing/long-title`，也支持 `/testing/long-title.html`

## ✅ 迁移程序和配置

- 将新目录的根目录下的 `package.json`, `astro.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.ts`, `bun.lockb` 拷贝到本地项目根目录
- 将 `src/` 拷贝到本地项目根目录

## ✅ 转换博客文章的文件路径、文件名、Frontmatter、以及正文格式

因为规则较为模糊，不要使用脚本，而是手动更新 `src/content/post/` 目录下的所有博客文章：

- ✅ 将博客文章的文件名从 `YYYY-MM-DD-title.html`, `YYYY/MM/YYYY-MM-DD-title.html` 转换为 `YYYY/MM/DD/title.mdx`，以保持之前已发布的博客的 URL 不变
  - 为了保持文件的 git 历史记录，使用 `git mv` 而不是直接移动文件
  - 已对所有文件完成此项更改，可以跳过
- ✅ 将所有文章的 `date` 字段重命名为 `publishDate`
- ✅ 将文章正文以你的理解转换为 Markdown JAX 格式
  - 保持文章内容不变，只调整格式以适配 Markdown JAX 的语法标准
  - 按 `.markdownlint.json` 配置文件中的规则，但忽略这些标准：
    - `MD013`：不对行数超过 80 行的行进行换行
    - `MD024`：允许有多个相同内容的标题
    - `MD037`：标记内允许有空格
    - `MD042`：允许空链接
- ✅ 对于文章内容，编写一段用于放在网页的 `<description/>` 标签服务于 SEO 的描述，更新在 Frontmatter 的 `description` 字段
- ✅ 对于 Frontmatter 里缺少 `title` 的文件，你来编写一个用于放在网页的 `<title/>` 标签内的标题，更新在 Frontmatter 的 `title` 字段
- ✅ `tags` 字段：
  - 将 `category` 字段内的属性放入 `tags` 字段，删除 `category` 字段
  - 将 `tags` 字段的内容全部转成小写字母
  - 确保没有重复的 tag、没有空字符 tag
  - 每个 tag 用双引号包裹，多个 tag 用逗号分隔
  - 例如：`tags: ["moveabletype", "jekyll", "tech"]`
- ✅ 最后运行 `bunx autocorrect --fix {mxd_file_path} && bunx markdownlint-cli2 --fix {mxd_file_path}` 来格式化处理完的 `.mdx` 文件

需要处理的博客的文件列表如下（已省略相对路径前缀 `src/content/post/` ）：

- [x] `2002/12/12/000007.mdx`: dalian plane crash arson investigation
- [x] `2002/12/19/000008.mdx`: ba jin donated books secondhand stores
- [x] `2002/12/26/000009.mdx`: hu jintao new ccp leader report
- [x] `2003/01/01/000010.mdx`: kang xiaoguang elite social responsibility
- [x] `2003/01/09/000011.mdx`: soochow university legal elites
- [x] `2003/01/23/000012.mdx`: china japan deflation relationship
- [x] `2003/02/13/000013.mdx`: guangzhou sars outbreak february 2003
- [x] `2003/03/13/000014.mdx`: china constitutionalism expert interviews
- [x] `2003/03/20/000015.mdx`: china historical guiwei years choices
- [x] `2003/04/03/000016.mdx`: chinese fishing boat sri lanka pirates
- [x] `2003/05/08/000017.mdx`: towards the republic tv series backstory
- [x] `2003/05/08/000018.mdx`: china online gaming industry disputes
- [x] `2003/05/15/000019.mdx`: sars rumors 14 chinese provinces
- [x] `2003/05/29/000020.mdx`: guangzhou property owners rights movement
- [x] `2003/06/05/000021.mdx`: three gorges dam relocation
- [x] `2003/06/05/000022.mdx`: zhou zhengyi shanghai richest man
- [x] `2003/06/05/000023.mdx`: hu jintao russia diplomatic tour
- [x] `2003/07/03/000024.mdx`: literary historical inaccuracies battle
- [x] `2003/07/10/000025.mdx`: peking university faculty reform
- [x] `2003/07/17/000026.mdx`: british museum chinese artifacts
- [x] `2003/07/17/000027.mdx`: tan sitong wuxu reform martyrdom
- [x] `2003/07/31/000028.mdx`: yangliuhu dam dujiangyan heritage
- [x] `2003/08/14/000029.mdx`: china judicial system reform
- [x] `2003/09/04/000030.mdx`: china urban demolition policies
- [x] `2003/09/18/000031.mdx`: western criticism china rmb policy
- [x] `2003/10/09/000032.mdx`: dongyue temple wing demolition
- [x] `2003/10/09/000033.mdx`: nobel winner jm coetzee profile
- [x] `2003/10/16/000034.mdx`: jin yong wulin alliance huashan
- [x] `2003/11/06/000035.mdx`: sun dawu confucian business empire
- [x] `2003/11/06/000036.mdx`: khodorkovsky russia arrest analysis
- [x] `2003/11/13/000037.mdx`: hengyang fire regulatory failures
- [x] `2003/11/23/000005.mdx`: us chinese child safety comparison
- [x] `2003/11/26/000006.mdx`: custom google search interface
- [x] `2003/11/27/000038.mdx`: sanmenxia dam 50-year history
- [x] `2003/12/04/000001.mdx`: movabletype windows xp installation
- [x] `2003/12/05/000003.mdx`: pagerank is dead article translation
- [x] `2003/12/05/000004.mdx`: htmlarea movabletype wysiwyg editor
- [x] `2003/12/07/000039.mdx`: verycd google pagerank 4 achievement
- [x] `2003/12/08/000040.mdx`: google baidu encoding issues comparison
- [x] `2003/12/08/000041.mdx`: china football south korea failures
- [x] `2003/12/09/000042.mdx`: ke shouliang taiwanese stuntman death
- [x] `2003/12/12/000043.mdx`: infernal affairs iii negative review
- [x] `2003/12/13/000044.mdx`: cronolog apache windows setup
- [x] `2003/12/13/000045.mdx`: wen jiabao us visit analysis
- [x] `2003/12/14/000047.mdx`: saddam hussein capture news coverage
- [x] `2003/12/15/000048.mdx`: flash reaction speed test game
- [x] `2003/12/15/000049.mdx`: windows notepad chinese encoding bug
- [x] `2003/12/16/000050.mdx`: fake google.net.cn website exposure
- [x] `2003/12/18/000046.mdx`: google pagerank algorithm translation
- [x] `2003/12/18/000051.mdx`: pagerank formula random surfer model
- [x] `2003/12/19/000051.mdx`: duplicate pagerank formula
- [x] `2003/12/20/000052.mdx`: xiao anning company assets seizure
- [x] `2003/12/21/000053.mdx`: pagerank formula versions comparison
- [x] `2003/12/21/000054.mdx`: campus life pirated lotr movie
- [x] `2003/12/23/000055.mdx`: china fourth constitutional amendment
- [x] `2003/12/24/000056.mdx`: msn messenger holiday icons
- [x] `2003/12/25/000057.mdx`: christmas day illness
- [x] `2003/12/27/000058.mdx`: pagerank iterative calculation
- [x] `2003/12/28/000059.mdx`: catching a cold note
- [x] `2003/12/29/000060.mdx`: wenzhou real estate investment
- [x] `2003/12/29/000061.mdx`: plaintiff requesting case loss
- [x] `2003/12/29/000062.mdx`: science magazine 2003 breakthroughs
- [x] `2003/12/29/000063.mdx`: us china trade tensions
- [x] `2003/12/29/000064.mdx`: russia japan china oil pipeline
- [x] `2003/12/31/000065.mdx`: adsl router setup
- [x] `2004/01/02/000066.mdx`: best man experience
- [x] `2004/01/04/000067.mdx`: chinese new year reflections
- [x] `2004/01/05/000068.mdx`: sars virus mutation report
- [x] `2004/01/06/000069.mdx`: google meta search code
- [x] `2004/01/07/000070.mdx`: einstein logic puzzle
- [x] `2004/01/08/000071.mdx`: lu xun style parodies
- [x] `2004/01/09/000072.mdx`: superstitions about 2003 challenges
- [x] `2004/01/10/000073.mdx`: vobsub subtitle timing adjustment
- [x] `2004/01/11/000074.mdx`: han king city destroyed by yellow river
- [x] `2004/01/12/000075.mdx`: website reaches pagerank 5
- [x] `2004/01/13/000076.mdx`: china's multipolar diplomatic strategy
- [x] `2004/01/14/000077.mdx`: population density and industrial accidents
- [x] `2004/01/14/000078.mdx`: hms amethyst yangtze river incident
- [x] `2004/01/15/000079.mdx`: paypal registration and verification guide
- [x] `2004/01/16/000080.mdx`: pagerank implementation in google search
- [x] `2004/01/17/000081.mdx`: google toolbar pagerank display explained
- [x] `2004/01/18/000082.mdx`: urban social networking via bus stops
- [x] `2004/01/19/000083.mdx`: pmwiki windows setup with chinese support
- [x] `2004/01/20/000085.mdx`: sleep schedule disruption during vacation
- [x] `2004/01/21/000086.mdx`: chinese new year greeting with audio
- [x] `2004/01/22/000087.mdx`: preserving chinese new year festive atmosphere
- [x] `2004/01/23/000088.mdx`: movabletype subcategories plugin review
- [x] `2004/01/25/000089.mdx`: chinese new year as cultural birthmark
- [x] `2004/01/26/000090.mdx`: new music search engine announcement
- [x] `2004/01/28/000091.mdx`: saint seiya anime chinese animation critique
- [x] `2004/01/29/000092.mdx`: sars bird flu pandemics comparison
- [x] `2004/01/30/000093.mdx`: shanghai bird flu school return
- [x] `2004/01/31/000094.mdx`: novarg mydoom virus prevention
- [x] `2004/02/03/000095.mdx`: wang jianshuo shanghai map viewer
- [x] `2004/02/04/000096.mdx`: shanghai map project challenges
- [x] `2004/02/10/000098.mdx`: turck mmcache php optimization
- [x] `2004/02/11/000097.mdx`: java hello world environment setup
- [x] `2004/02/12/000099.mdx`: shanghai city map download links
- [x] `2004/02/13/000100.mdx`: removing windows messenger from xp
- [x] `2004/02/14/000101.mdx`: putin wealth disclosure reelection
- [x] `2004/02/15/000102.mdx`: yan lingjun youth reading course
- [x] `2004/02/20/000103.mdx`: han wang city yellow river destruction
- [x] `2004/02/24/000104.mdx`: multiple lans windows connection
- [x] `2004/02/28/000105.mdx`: china higher education job market critique
- [x] `2004/03/05/000106.mdx`: java 24 points math game calculator
- [x] `2004/03/08/000107.mdx`: 2003 film industry year of finales
- [x] `2004/03/09/000108.mdx`: chinese radio sex education critique
- [x] `2004/03/10/000109.mdx`: shanghai high temperature record
- [x] `2004/03/11/000110.mdx`: assembly 7-segment display control
- [x] `2004/03/12/000111.mdx`: joyes.com free mobile games
- [x] `2004/03/13/000112.mdx`: java terminal snake game code
- [x] `2004/03/14/000110.mdx`: duplicate assembly program
- [x] `2004/03/18/000113.mdx`: friend blog hacking joke
- [x] `2004/03/20/000114.mdx`: taiwan presidential election controversy
- [x] `2004/03/21/000115.mdx`: taiwan election protests update
- [x] `2004/03/21/000116.mdx`: adsl modem routing guide
- [x] `2004/03/21/000117.mdx`: adsl campus network followup
- [x] `2004/03/23/000118.mdx`: multiple network connections tutorial
- [x] `2004/03/30/000119.mdx`: advanced networking with route command
- [x] `2004/03/30/000120.mdx`: passing scjp exam announcement
- [x] `2004/04/10/000122.mdx`: server migration performance
- [x] `2004/04/10/000123.mdx`: fu sinian historiography chinese history
- [x] `2004/04/12/000124.mdx`: cleanliness obsession cultural analysis
- [x] `2004/04/23/000125.mdx`: yasukuni shrine japan politics controversy
- [x] `2004/04/30/000126.mdx`: kang youwei economic life residences
- [x] `2004/05/02/000127.mdx`: blog absence work update
- [x] `2004/05/03/000128.mdx`: notebook shopping bargaining tips
- [x] `2004/05/07/000129.mdx`: mvc php architecture development
- [x] `2004/05/08/000130.mdx`: python programming first impression
- [x] `2004/05/15/000131.mdx`: movabletype becoming paid software
- [x] `2004/06/06/000132.mdx`: rational political analysis article share
- [x] `2004/06/24/000133.mdx`: saying goodbye after dawn graduation
- [x] `2004/09/03/000134.mdx`: baidu acquisition of hao123 analysis
- [x] `2004/09/05/000136.mdx`: verycd p2p platform development commitment
- [x] `2004/09/06/000135.mdx`: heartbreak after long relationship
- [x] `2004/09/07/000137.mdx`: gmail invitation from friend windix
- [x] `2004/09/08/000138.mdx`: flash escape games walkthrough guide
- [x] `2004/09/09/000139.mdx`: google chinese news service launch
- [x] `2004/09/11/000140.mdx`: verycd invision power board localization
- [x] `2004/09/21/000141.mdx`: humorous chinese history one-liners
- [x] `2004/09/22/000142.mdx`: satirical dating guide for taken women
- [x] `2004/11/14/000143.mdx`: persistence focus and blog return
- [x] `2004/11/16/000144.mdx`: apache logs management technical guide
- [x] `2004/11/18/000145.mdx`: verycd server infrastructure changes
- [x] `2004/11/19/000146.mdx`: gfans.org domain for google fansite
- [x] `2004/11/20/000147.mdx`: firefox 1.0 success and google support
- [x] `2004/11/22/000148.mdx`: zend sales director meeting php china
- [x] `2005/07/10/000001.mdx`: blog setup on linux
- [x] `2005/07/11/000002.mdx`: tech office team at verycd
- [x] `2005/07/12/000004.mdx`: google adsense optimization
- [x] `2005/07/13/000003.mdx`: china internet evolution
- [x] `2005/07/14/000005.mdx`: online community websites analysis
- [x] `2005/07/15/000006.mdx`: defense of 3721 browser plugin
- [x] `2005/07/16/000007.mdx`: idg capital critique
- [x] `2005/07/17/000008.mdx`: ma ying-jeou election commentary
- [x] `2005/07/19/000009.mdx`: personal transportation mishaps
- [x] `2005/07/22/000010.mdx`: chinese internet copycat culture
- [x] `2005/07/26/000011.mdx`: google competitor relationships
- [x] `2005/08/18/000013.mdx`: flickr technical and historical analysis
- [x] `2005/08/21/000014.mdx`: internet democracy essay
- [x] `2005/08/22/000015.mdx`: verycd emule translation battle
- [x] `2005/08/24/000016.mdx`: google talk launch commentary
- [x] `2005/08/28/000017.mdx`: loreal hao123 comparison
- [x] `2005/08/28/000018.mdx`: personal quirks blog meme
- [x] `2005/08/31/000020.mdx`: yahoo flickr acquisition critique
- [x] `2005/08/31/000022.mdx`: google talk minimalist ui review
- [x] `2005/10/17/000023.mdx`: rss reader google reader adoption
- [x] `2005/10/17/000024.mdx`: becoming a ning developer
- [x] `2005/10/18/000025.mdx`: choosing feedburner for rss services
- [x] `2005/10/19/000026.mdx`: it industry importance apple example
- [x] `2005/10/22/000027.mdx`: google sitemap for movabletype
- [x] `2005/10/23/000028.mdx`: google original web2.0 model
- [x] `2005/11/17/000029.mdx`: million dollar homepage copycat sites
- [x] `2005/12/28/000030.mdx`: chen yizhou donews acquisition questions
- [x] `2006/01/05/000031.mdx`: chinese new year zodiac goals
- [x] `2006/01/17/000032.mdx`: shanghai xiamen service comparison
- [x] `2006/01/18/000033.mdx`: msn account accidental deletion
- [x] `2006/01/20/000034.mdx`: verycd forum 200000 topics milestone
- [x] `2006/01/28/000035.mdx`: cctv spring festival gala critique
- [x] `2006/06/07/000046.mdx`: 2006 gaokao essay prompts
- [x] `2006/07/06/000047.mdx`: windows linux mac os transition
- [x] `2006/07/13/000050.mdx`: blind nationalism online critique
- [x] `2006/07/13/000051.mdx`: china japan relations responses
- [x] `2006/09/14/000052.mdx`: xml xsl academic assignment
- [x] `2006/09/15/000053.mdx`: itunes apple product anticipation
- [x] `2006/09/16/000054.mdx`: breast cancer treatment help request
- [x] `2006/09/25/000055.mdx`: shanghai social security corruption
- [x] `2006/12/20/000057.mdx`: movabletype 500 errors apache timeout
- [x] `2006/12/22/000058.mdx`: sunrise sunset calculator google maps
- [x] `2007/01/01/000059.mdx`: hong kong 1997 handover reflections
- [x] `2007/03/10/000061.mdx`: google chinese portal design critique
- [x] `2007/03/12/000062.mdx`: shanghai changning food spots nostalgia
- [x] `2007/03/20/000064.mdx`: blogs seo fighting online fraud
- [x] `2007/03/22/000065.mdx`: heavenfox young programming prodigy
- [x] `2007/03/23/000066.mdx`: easymorning show shanghai media takeover
- [x] `2007/03/30/000067.mdx`: quicksilver mac recommendation
- [x] `2007/06/10/000068.mdx`: accessing blocked flickr in china
- [x] `2007/10/28/000069.mdx`: currency wars book analysis
- [x] `2009/01/01/000199.mdx`: china real estate market analysis
- [x] `2009/02/13/000207.mdx`: unix timestamp 1234567890 milestone
- [x] `2006/02/15/000036.mdx`: internet censorship in china
- [x] `2006/02/16/000037.mdx`: cdn server manipulation exposure
- [x] `2006/02/17/000039.mdx`: windows defender overview
- [x] `2006/03/07/000040.mdx`: netease news update
- [x] `2006/04/12/000043.mdx`: google chinese branding event
- [x] `2006/04/13/000044.mdx`: baidu google china comparison
- [x] `2006/04/22/000045.mdx`: sony customer service critique
- [x] `2006/07/07/000048.mdx`: baidu community strategy google comparison
- [x] `2006/07/08/000049.mdx`: warning against chauvinism
- [x] `2008/03/11/000130.mdx`: school memories
- [x] `2008/04/24/000147.mdx`: chinese state-owned companies critique
- [x] `2013/06/23/rebuild-blog-with-jekyll.mdx`: blog jekyll migration
- [x] `2023/01/01/ml-is-the-infra-of-all-industry.mdx`: ml as industry infrastructure
- [x] `2023/05/15/compression-is-intelligence.mdx`: compression as intelligence concept
- [x] `2023/05/18/montanas-ban-on-tiktok-is-unconstitutional.mdx`: montana tiktok ban unconstitutional
- [x] `2023/06/24/wagner-is-helping-putin.mdx`: wagner group putin assistance
- [x] `2023/09/12/its-been-12-years-for-tim.mdx`: tim cook 12-year anniversary
- [x] `2025/03/15/multiplanet-civilization-v-earth-gravity.mdx`: multiplanet civilization earth gravity

follow these steps:

1. manually (DO NOT use script) proceed the next unchecked file
2. mark the processed file as checked
3. compact context to reduce token usage
4. repeat step 1 until finishing all the files

## ✅ 修改 cactus 主题

- 使用 `iA Writer Mono` 作为默认字体
- 增加页面在宽屏上的宽度
- 修改自我介绍，完善关于页面

## ✅ 使用 GitHub Actions 部署

- 使用 `withastro/action@v3` 部署
- 使用 `actions/deploy-pages@v4` 部署

## ✅ 强化 SEO

- ✅ 使用 `@astrojs/sitemap` 生成 sitemap
- ✅ 使用 `@astrojs/robots` 生成 robots.txt
- ✅ 使用 `@astrojs/rss` 生成 RSS 订阅

## ✅ 保持 URL 向后兼容

### 问题

博客经历了三个不同的历史时期，每个时期有不同的 URL 格式：

1. MoveableType 时期的文章（发布日期 < `2013-05-31`）：

   - URL 格式：`/YYYY/MM/DD/SEQ.html`（如：`/2009/02/13/000207.html`）
   - 特点：使用序列号而非文章标题作为标识符

2. Jekyll 时期的文章 (`2013-05-31` <= 发布日期 < `2025-02-28`)：

   - URL 格式：`/YYYY/MM/DD/title.html`（如：`/2023/09/12/its-been-12-years-for-tim.html`）
   - 特点：使用文章标题作为标识符，但仍然保留 `.html` 后缀

3. Astro 时期的文章 (`2025-02-28` <= 发布日期)：
   - URL 格式：`/YYYY/MMDD-title`（如：`/2025/0315-multiplanet-civilization-v-earth-gravity`）
   - 特点：使用更简洁的日期格式，去掉了 `/` 分隔符和 `.html` 后缀

为保持向后兼容性，需要确保旧的 URL 格式仍然有效，同时为新文章使用更现代的 URL 结构。

### 解决方案

#### 1. 为静态站点实现 URL 兼容性

由于站点是静态生成的，无法依赖服务器重定向，我们需要一种在构建时处理 URL 格式的方法。

创建 `src/utils/url.ts` 文件，实现以下功能：

```typescript
import type { CollectionEntry } from "astro:content";

// 定义历史时期的分界日期
export const JEKYLL_START_DATE = new Date("2013-05-31");
export const ASTRO_START_DATE = new Date("2025-02-28");

/**
 * 判断文章属于哪个历史时期
 * @param publishDate 文章发布日期
 * @returns 文章所属的历史时期
 */
export function getBlogEra(publishDate: Date): "moveabletype" | "jekyll" | "astro" {
  if (publishDate < JEKYLL_START_DATE) {
    return "moveabletype";
  } else if (publishDate < ASTRO_START_DATE) {
    return "jekyll";
  } else {
    return "astro";
  }
}

/**
 * 根据发布日期决定文章的规范 URL 格式
 * @param post 文章对象
 * @returns 规范化的 URL 路径
 */
export function getCanonicalUrl(post: CollectionEntry<"post">): string {
  const publishDate = post.data.publishDate;
  const siteUrl = import.meta.env.SITE || "https://xdanger.com";
  const postId = post.id.startsWith("/") ? post.id.substring(1) : post.id;

  // 根据文章发布时间确定 URL 格式
  const era = getBlogEra(publishDate);

  if (era === "moveabletype" || era === "jekyll") {
    // MoveableType 和 Jekyll 时期的文章都带 .html 后缀
    return `${siteUrl}/${postId}.html`;
  } else {
    // Astro 时期的文章不带后缀
    return `${siteUrl}/${postId}`;
  }
}

/**
 * 判断是否为新 URL 格式 (Astro 时期的文章)
 */
export function isAstroEraPost(post: CollectionEntry<"post">): boolean {
  return post.data.publishDate >= ASTRO_START_DATE;
}

/**
 * 根据文章 ID 获取正确的路径
 * 用于内部链接、导航等
 * @param post 文章对象
 * @returns 正确格式的路径
 */
export function getPostPath(post: CollectionEntry<"post">): string {
  const publishDate = post.data.publishDate;
  const postId = post.id.startsWith("/") ? post.id.substring(1) : post.id;

  // 根据文章所属时期确定 URL 格式
  const era = getBlogEra(publishDate);

  if (era === "moveabletype" || era === "jekyll") {
    // MoveableType 和 Jekyll 时期的文章都带 .html 后缀
    return `/${postId}.html`;
  } else {
    // Astro 时期的文章不带后缀
    return `/${postId}`;
  }
}
```

#### 2. 修改 getStaticPaths 生成正确格式的 URL 页面

修改 `src/pages/[...slug].astro` 文件，确保旧文章只生成带 `.html` 后缀的页面，新文章只生成不带后缀的页面：

```typescript
import { isAstroEraPost } from "@/utils/url";

export const getStaticPaths = (async () => {
  const blogEntries = await getAllPosts();

  return blogEntries.map((post) => {
    // 提取文章 id 作为 slug
    const slug = post.id;

    // MoveableType 和 Jekyll 时期的文章生成带 .html 后缀的 URL
    if (!isAstroEraPost(post)) {
      return {
        params: { slug: `${slug}.html` },
        props: { post },
        priority: -1
      };
    }

    // 对于 Astro 时期的文章，生成不带后缀的 URL 格式
    return {
      params: { slug },
      props: { post },
      priority: -1
    };
  });
}) satisfies GetStaticPaths;
```

#### 3. 更新站点模板组件以使用正确的 URL

为确保所有页面的内部链接和引用都使用正确的 URL 格式，修改以下组件：

1. 更新 `src/components/blog/PostPreview.astro` 以使用 `getPostPath`：

```typescript
import { getPostPath } from "@/utils/url";

// 在组件中使用
const postUrl = getPostPath(post);
```

2. 更新 RSS feed 生成器以使用正确的 URL 格式：

```typescript
// src/pages/rss.xml.ts
import { getCanonicalUrl } from "@/utils/url";

// 在遍历文章生成 RSS 条目时
items: sortedPosts.map((post) => ({
  link: getCanonicalUrl(post), // 这会根据文章日期自动添加或省略 .html 后缀
  // 其他 RSS 条目属性
})),
```

3. 更新 Sitemap 生成器，只提供正确格式的 URL：

创建 `src/pages/sitemap-custom.xml.ts` 覆盖默认的 sitemap：

```typescript
import { getCanonicalUrl } from "@/utils/url";
import { getAllPosts } from "@/data/post";

export async function GET() {
  const posts = await getAllPosts();

  // 生成规范化 URL
  const urlEntries = posts.map((post) => {
    const canonicalUrl = getCanonicalUrl(post);

    // URL 条目
    return `
      <url>
        <loc>${canonicalUrl}</loc>
        <lastmod>${post.data.updatedDate || post.data.publishDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
    `;
  });

  // 生成完整的 sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${urlEntries.join("")}
    </urlset>
  `;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
```

#### 4. 修改文章创建规则

根据文章所属的历史时期，遵循不同的命名和 URL 规则：

1. MoveableType 时期的文章（发布日期 < `2013-05-31`）：

   - 文件路径：`src/content/post/YYYY/MM/DD/SEQ.mdx`
   - 生成的 URL：`/YYYY/MM/DD/SEQ.html`
   - 示例：
     - 文件：`src/content/post/2009/02/13/000207.mdx`
     - URL：`/2009/02/13/000207.html`

2. Jekyll 时期的文章 (`2013-05-31` <= 发布日期 < `2025-02-28`)：

   - 文件路径：`src/content/post/YYYY/MM/DD/title.mdx`
   - 生成的 URL：`/YYYY/MM/DD/title.html`
   - 示例：
     - 文件：`src/content/post/2023/09/12/its-been-12-years-for-tim.mdx`
     - URL：`/2023/09/12/its-been-12-years-for-tim.html`

3. Astro 时期的文章 (`2025-02-28` <= 发布日期)：
   - 文件路径：`src/content/post/YYYY/MMDD-title.mdx`
   - 生成的 URL：`/YYYY/MMDD-title`
   - 示例：
     - 文件：`src/content/post/2025/0315-multiplanet-civilization-v-earth-gravity.mdx`
     - URL：`/2025/0315-multiplanet-civilization-v-earth-gravity`

#### 5. 为页面添加规范链接标记

在 `src/components/BaseHead.astro` 中添加规范链接标记，确保搜索引擎正确识别页面版本：

```astro
---
// 如果是文章页面，导入并使用 getCanonicalUrl
import { getCanonicalUrl } from "@/utils/url";
const canonicalUrl = post ? getCanonicalUrl(post) : Astro.url.href;
---

<!-- 添加规范链接 -->
<link rel="canonical" href={canonicalUrl} />
```

#### 6. 实现顺序

1. 创建 `src/utils/url.ts` 工具函数
2. 修改 `src/pages/[...slug].astro` 和 `src/pages/posts/[...slug].astro` 以生成两种格式的 URL
3. 更新模板组件以使用正确的 URL 格式
4. 更新 sitemap 和 RSS feed 生成器
5. 添加规范链接标记
6. 使用 `bun run build` 构建站点并检查生成的文件结构

#### 7. 测试计划

1. ⌛️ 测试静态生成的 URL：

   - ✅ 确认 MoveableType 时期文章（< 2013-05-31）生成带 .html 后缀的静态 HTML，并使用序列号格式
   - ✅ 确认 Jekyll 时期文章（2013-05-31 到 2025-02-28）生成带 .html 后缀的静态 HTML，并使用标题格式
   - ✅ 确认 Astro 时期文章（>= 2025-02-28）生成不带后缀的静态 HTML 格式，并使用新的日期命名结构
   - ❌ 确认访问旧文章的非 .html URL 会导致 404 错误（这是预期行为）

2. ✅ 检查内部链接和引用：

   - 确认所有内部链接都指向正确格式的 URL：
     - MoveableType 和 Jekyll 时期文章使用 .html 后缀
     - Astro 时期文章不带后缀
   - 确认在 RSS feed 中使用的是正确格式的 URL

3. ✅ 检查 SEO 优化：

   - 确认 sitemap.xml 包含所有三种类型文章的正确格式 URL
   - 确认每个页面都有正确的规范链接标记
   - 确认 robots.txt 正确配置

4. ⌛️ 兼容性测试：
   - ✅ MoveableType 时期文章：
     - 测试 `/YYYY/MM/DD/SEQ.html` 格式（应该成功）
     - 测试 `/YYYY/MM/DD/SEQ` 格式（应该返回 404）
   - ✅ Jekyll 时期文章：
     - 测试 `/YYYY/MM/DD/title.html` 格式（应该成功）
     - 测试 `/YYYY/MM/DD/title` 格式（应该返回 404）
   - ❌ Astro 时期文章：
     - 测试 `/YYYY/MMDD-title` 格式（应该成功）
