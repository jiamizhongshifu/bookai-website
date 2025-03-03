const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateFavicons() {
    // 确保目标目录存在
    const faviconDir = path.join(__dirname, 'images', 'favicon');
    await fs.mkdir(faviconDir, { recursive: true });

    // 读取SVG源文件
    const svgBuffer = await fs.readFile('favicon.svg');

    // 定义需要生成的尺寸
    const sizes = {
        'favicon-16x16.png': 16,
        'favicon-32x32.png': 32,
        'apple-touch-icon.png': 180,
        'android-chrome-192x192.png': 192,
        'android-chrome-512x512.png': 512
    };

    // 生成不同尺寸的图标
    for (const [filename, size] of Object.entries(sizes)) {
        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(path.join(faviconDir, filename));
        
        console.log(`Generated ${filename}`);
    }
}

generateFavicons().catch(console.error); 