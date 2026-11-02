# 净图 MetaClear

2026-11-02 更新：电脑端支持拖入或选择整个文件夹，递归读取图片并保留子目录结构；单一根目录导出为 `原文件夹名-clean.zip`，压缩包内根目录同样增加 `-clean`。图片导入后自动清理，失败项可单独或批量重试。提供 200 KB、500 KB、1 MB 和仅清除不压缩四档，默认每张不超过 500,000 字节。符合大小且方向正常的小图保留清除后的原格式，其余转 JPG，先调整质量再按比例缩小，最终检查大小；透明区域填白，动画变静态。支持按顺序连续编号、完全相同文件的重复检测和使用原主体文件名的覆盖模式。混合多个根目录时使用中文名称 `净图-已清除图片.zip`。系统文件分享支持情况由浏览器决定；iPhone 推荐 Safari 多选图片。未做 iPhone 真机验收。

清除支持的 AI 提示词、生成软件、工作流等元数据，不写入伪造的软件记录；不保证移除像素级水印或被平台判定为非 AI。

浏览器本地图片元数据查看与清除工具。支持 JPEG、PNG、WebP；文件夹递归导入、目录结构保留、拖放、粘贴、自动批量处理、失败重试、元数据查看、敏感字段提示、重复文件跳过、自动编号、覆盖模式、无损清除、PNG/JPG/WebP 重新编码、单张下载及 ZIP 下载。无需服务端和数据库，无遥测。

在线使用：https://metaclear-image-tools.sitemap-huoqu.workers.dev/

本项目采用 MIT 许可证。第三方依赖许可证见 public/THIRD-PARTY-NOTICES.txt。

## 开发和部署

需要 Node.js 20.19+ 或 22.12+。

```sh
npm ci
npm run dev
npm test
npm run build
npm run deploy
```

部署使用已登录的 Cloudflare Wrangler，发布为静态 Worker。名称在 wrangler.jsonc 中设置。发布前请先构建。

## 实现与范围

- 参考功能：https://xtechtools.com/image-meta-strip/
- GitHub 调研：https://github.com/LeonardoDaviti/Exif-Metadata-Eraser 、https://github.com/AIFelixAI/metadata-remover 、https://github.com/ytmknd/MetaClean
- 使用 metadata-remover 的容器级清除引擎，不复制上述项目 UI；exifr 解析字段，fflate 打包 ZIP。依赖许可随 npm 包保留。
- 无损清除保留压缩像素及 ICC；存在 EXIF 旋转/镜像时要求选择重新编码。重新编码自动使用浏览器显示方向，JPEG 透明背景填白，动画仅导出静态帧。
- 输出再次扫描引擎支持的元数据块，不代表清除所有未知块、像素级水印或画面中的个人信息。最多 50 张，每张 50 MB；重新编码限制 4000 万像素。
- 文件留在内存中，不上传，不持久化；设置变化后需重新处理。页面关闭后会释放当前图片。

## 验证

测试覆盖 PNG 文本/XMP、JPEG EXIF/注释、WebP EXIF/XMP、像素数据保持、RIFF 长度及特征标记更新、重复清除和损坏输入拒绝。
