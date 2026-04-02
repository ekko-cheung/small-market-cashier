# supermarket-cashier

基于 Electron + Vite + React + TypeScript 的收银台桌面应用。

项目目标：

- 支持商品管理、销售记账、账单查询
- 支持多平台打包（Windows/macOS/Linux）
- 采用本地 SQLite（通过 Drizzle ORM）做数据持久化

---

## 🚀 主要功能

- 商品管理：新增/编辑/删除和价格设置
- 前台销售：扫码商品、数量修改、实时总价计算
- 账单管理：生成账单、历史账单查询、结果录入
- 数据持久化：使用 `drizzle-orm` + `better-sqlite3` 进行本地数据存储

---

## 🧩 项目结构

- `src/main`：Electron 主进程
  - `index.ts`：主进程入口
  - `ipc/`：Renderer 与主进程的 IPC 通信逻辑（`goods.ts`, `bills.ts`, `payment.ts`）
- `src/preload`：预加载脚本（安全地暴露 API）
- `src/renderer`：前端页面与 React 组件
  - `src/App.tsx`：应用入口
  - `pages/`：业务页面（`Goods`, `Bills`, `FrontDeskSales`, `Payments`, `Home`）
  - `components/`：通用组件（`CreateGoodsDrawer.tsx`）
- `src/db`：数据库连接与操作
- `src/drizzle`：Drizzle SQL 迁移脚本与元数据

---

## 🛠 环境依赖

需要安装：

- Node.js 18+
- pnpm
- Git

推荐 IDE：

- VSCode + ESLint + Prettier

---

## ▶️ 本地开发

```bash
pnpm install
pnpm dev
```

---

## 📦 构建发布

```bash
# Windows
pnpm build:win

# macOS
pnpm build:mac

# Linux
pnpm build:linux
```

## 构建产物位于 `dist/` 或 `build/`（取决于 electron-builder 配置）。

## 📌 常见问题

1. 数据库迁移未生效？
   - 检查 `src/drizzle` 目录内的 SQL 迁移文件是否累积, 并确保本地数据库文件可写。
2. 打包失败？
   - macOS 需有 Xcode CLI 工具；Windows 需正确安装 `wine`（在非 Windows 平台）。

---

## 🗂 关键文件说明

- `electron.vite.config.ts`：Electron + Vite 集成配置
- `drizzle.config.ts`：Drizzle ORM 数据库配置
- `src/main/index.ts`：创建主窗口并初始化 IPC
- `src/preload/index.ts`：暴露安全 API `window.api`

---

## 📄 许可

MIT
