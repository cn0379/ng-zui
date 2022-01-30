export interface RouterList {
  components: Array<{
    name: string;
    language: string;
    experimentalChildren: Array<{
      path: string;
      hidden: boolean;
      description: string;
      experimental: boolean;
      label: string;
      zh: string;
    }>;
    children: Array<{
      cover: string;
      path: string;
      hidden: boolean;
      description: string;
      experimental: boolean;
      label: string;
      zh: string;
    }>;
  }>;
  intro: Array<{
    path: string;
    label: string;
    language: string;
    order: number;
    hidden: boolean;
    description: string;
    experimental: boolean;
  }>;
}


export const ROUTE_LIST:RouterList = {
  'intro':[
    {
      "path": "docs/introduce/en",
      "label": "Ant Design of Angular",
      "language": "en",
      "order": 0,
      "hidden": false,
      "description": "Angular Ant Design of Angular Component, An enterprise-class Angular UI component library based on Ant Design, all components are open source and free...",
      "experimental": false
    },
    {
      "path": "docs/introduce/zh",
      "label": "Ant Design of Angular",
      "language": "zh",
      "order": 0,
      "hidden": false,
      "description": "Angular Ant Design of Angular Component, z-ui 是遵循 Ant Design 设计规范的 Angular UI 组件库，主要用于研发企业级中后台产品。全部代码开源并遵循 MIT 协议，任何企业、组织及个人均可免费使用。提炼自企业级中后台产...",
      "experimental": false
    },
  ],
  'components': [
    {
      "name": "通用",
      "language": "zh",
      "children": [
        {
          "label": "Button",
          "path": "components/button/zh",
          "zh": "按钮",
          "experimental": false,
          "hidden": false,
          "cover": "https://gw.alipayobjects.com/zos/alicdn/fNUKzY1sk/Button.svg",
          "description": "Angular 按钮组件，按钮用于开始一个即时操作。标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。在 Ant Design 中，我们有四种按钮。主按钮：用于主行动点，一个操作区域只能有一个主按钮。默认按钮：用于没有主次之分的一组行动点。虚线按钮：常用于添加操作。文本按钮：用..."
        },
        {
          "label": "Icon",
          "path": "components/icon/zh",
          "zh": "图标",
          "experimental": false,
          "hidden": false,
          "cover": "https://gw.alipayobjects.com/zos/alicdn/rrwbSt3FQ/Icon.svg",
          "description": "Angular 图标组件，语义化的矢量图形。新版图标可能略有缺失，我们将与 Ant Design 同步保持图标的更新。我们与 Ant Design 同步，使用了 svg 图标替换了原先的 font 图标，从而带来了以下优势：完全离线化使用，不需要从支付宝 cdn 下载字体文件，图标不会因为网络问题呈..."
        },
        {
          "label": "Typography",
          "path": "components/typography/zh",
          "zh": "排版",
          "experimental": false,
          "hidden": false,
          "cover": "https://gw.alipayobjects.com/zos/alicdn/GOM1KQ24O/Typography.svg",
          "description": "Angular 排版组件，文本的基本格式。当需要展示标题、段落、列表内容时使用，如文章/博客/日志的文本样式。当需要一列基于文本的基础操作时，如拷贝/省略/可编辑。"
        }
      ],
      "experimentalChildren": [
        {
          "label": "Pipes",
          "path": "experimental/pipes/zh",
          "zh": "",
          "experimental": true,
          "hidden": false,
          "description": "Angular Pipes Component, NG-ZORRO 实验性功能是指已发布但不稳定或者还未准备好用于生产环境的功能。开发者或用户可以选择在正式发布前使用这些功能，但是每次发布版本时都可能存在 breaking changes。项目中常用 Pipe 集合引入 Pipe 后，像 angul..."
        }
      ]
    },
  ]
}
