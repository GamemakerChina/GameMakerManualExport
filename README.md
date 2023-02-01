# GameMakerManualExport
Export translated files to GameMaker Manual

## 用法
```bash
请确保系统内安装有 Node.js 环境后，在 GameMakerManualExport 下打开命令行，输入以下命令：

# 安装依赖
npm config set registry https://registry.npmmirror.com # 如果速度慢执行该命令
npm install -g pnpm # 推荐使用 pnpm 加快安装
pnpm install

# （注入式）同时导入文档、目录、词汇表并注入CSS
pnpm run plugged:import

# （静态式）同时导入文档、目录、词汇表并注入CSS
pnpm run static:import

# （静态式）注入翻译译者信息
pnpm run static:team

# 清空全部
pnpm run clean:all

# 清空导入结果
pnpm run clean:import

# 清空导入过程中产生的JSON缓存
pnpm run clean:json
```