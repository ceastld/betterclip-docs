import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {PluginOptions as LocalSearchOptions} from '@easyops-cn/docusaurus-search-local';

const config: Config = {
  title: 'BetterClip',
  tagline: 'Windows 剪贴板管理器使用说明与更新记录',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://betterclip-docs.pages.dev',
  baseUrl: '/',

  organizationName: 'ceastld',
  projectName: 'betterclip-docs',

  onBrokenLinks: 'throw',

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
          editUrl: 'https://github.com/ceastld/betterclip-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'BetterClip',
      logo: {
        alt: 'BetterClip',
        src: 'img/logo.svg',
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
          label: '更新记录',
          position: 'left',
        },
        {
          href: 'https://github.com/ceastld/betterclip-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '简介',
              to: '/',
            },
            {
              label: '功能介绍',
              to: '/features',
            },
            {
              label: '更新记录',
              to: '/changelog',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ceastld/betterclip-docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} BetterClip. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
