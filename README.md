# GameMakerManualExport
Export translated files to GameMaker Manual

## 用法
```bash
请确保系统内安装有 Node.js 环境后，在 GameMakerManualExport 下打开命令行，输入以下命令：

# 安装依赖
npm config set registry https://registry.npmmirror.com # 如果速度慢执行该命令
npm install -g pnpm # 推荐使用 pnpm 加快安装
pnpm install

# （所有方式）复制需要准备的文件，无论使用哪种方式请必须先执行这个
pnpm run init:build

# （外挂式）生成依赖
pnpm run plugged:gendep

# （外挂式）同时导入文档、目录、词汇表并外挂CSS
pnpm run plugged:import

# （外挂式）注入翻译译者信息
pnpm run plugged:team

# （静态式）生成依赖
pnpm run static:gendep

# （静态式）同时导入文档、目录、词汇表并外挂CSS
pnpm run static:import

# （静态式）注入翻译译者信息
pnpm run static:team

# 清空全部
pnpm run clean:all

# 清空导入结果
pnpm run clean:import

# 清空导入过程中产生的缓存
pnpm run clean:temp
```