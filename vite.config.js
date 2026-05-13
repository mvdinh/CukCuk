import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// Middleware lưu ảnh vào thư mục public/uploads
function uploadPlugin() {
  return {
    name: 'upload-plugin',
    configureServer(server) {
      server.middlewares.use('/upload-local', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk.toString());
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const { filename, base64 } = data;
              const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
              
              const uploadDir = path.resolve(__dirname, 'public/uploads');
              if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
              }
              
              fs.writeFileSync(path.join(uploadDir, filename), base64Data, 'base64');
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, path: `/uploads/${filename}` }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), uploadPlugin()],
})
