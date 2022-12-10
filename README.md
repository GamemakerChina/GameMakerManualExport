# GameMakerManualExport
Export translated files to GameMaker Manual

## 用法
```bash
请确保系统内安装有 Node.js 环境后，在 GameMakerManualExport 下打开命令行，输入以下命令：

# 安装依赖
npm config set registry https://registry.npmmirror.com # 如果速度慢执行该命令
npm install -g pnpm # 推荐使用 pnpm 加快安装
pnpm install

# 同时导入文档和目录并注入翻译信息和 CSS
pnpm run start:all
```