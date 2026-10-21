import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {PluginOptions as LocalSearchOptions} from '@easyops-cn/docusaurus-search-local';

const config: Config = {
  title: 'Cea 剪贴板',
  tagline: 'eaclip（ClipHost）Windows 剪贴板管理工具使用文档',
  favicon: 'img/favicon.ico',
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        href: '/img/apple-touch-icon.png',
      },
    },
  ],

  future: {
    v4: true,
  },

  url: 'https://betterclip-docs.liud0519.workers.dev',
  baseUrl: '/',

  organizationName: 'ceastld',
  projectName: 'betterclip-docs',

  onBrokenLinks: 'throw',

  // docs/*.md are generated from the product repo's docs/user (plain Markdown, not MDX).
  markdown: {
    format: 'detect',
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en', 'zh'],
        docsRouteBasePath: '/',
        indexBlog: false,
        indexPages: false,
      } satisfies LocalSearchOptions,
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/apple-touch-icon.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Cea 剪贴板',
      logo: {
        alt: 'Cea 剪贴板',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: '文档',
        },
        {
          to: '/changelog',
          label: '更新日志',
          position: 'left',
        },
        {
          href: 'https://github.com/ceastld/eaclip/releases/latest',
          label: '下载',
          position: 'right',
        },
        {
          href: 'https://github.com/QuickerHub/cea-action-issues/issues',
          label: '反馈',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {label: '使用说明', to: '/usage'},
        {label: '安装和配置', to: '/install'},
        {label: '常见问题', to: '/faq'},
        {label: '更新日志', to: '/changelog'},
        {label: '下载', href: 'https://github.com/ceastld/eaclip/releases/latest'},
        {label: '问题反馈', href: 'https://github.com/QuickerHub/cea-action-issues/issues'},
      ],
      copyright: `© ${new Date().getFullYear()} Cea 剪贴板（eaclip）`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
