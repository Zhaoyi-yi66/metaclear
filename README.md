# 净图 MetaClear

浏览器本地图片元数据查看与清除工具。支持 JPEG、PNG、WebP；拖放、粘贴、批量处理、元数据查看、敏感字段提示、无损清除、PNG/JPG/WebP 重新编码、单张下载及 ZIP 下载。无需服务端和数据库，无遥测。

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
- 文件留在内存中，不上传，不持久化；设置变化后需重新处理。核心资源加载后当前页面可离线工作。

## 验证

测试覆盖 PNG 文本/XMP、JPEG EXIF/注释、WebP EXIF/XMP、像素数据保持、RIFF 长度及特征标记更新、重复清除和损坏输入拒绝。
