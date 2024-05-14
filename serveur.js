import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import fs from 'node:fs';
import { exec } from 'child_process';

const server = createServer((req, res) => {
    let filePath = req.url === '/' ? 'index.html' : req.url.slice(1); // Si l'URL est '/', chargez 'index.html'
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Error: File Not Found');
        } else {
            // Déterminez le type de contenu en fonction de l'extension du fichier
            let contentType = 'text/html';
            if (filePath.endsWith('.css')) {
                contentType = 'text/css';
            } else if (filePath.endsWith('.js')) {
                contentType = 'application/javascript';
            } else if (filePath.endsWith('.png')) {
                contentType = 'image/png';
            } else if (filePath.endsWith('.otf')) {
                contentType = 'font/otf';
            }

            res.writeHead(200, {'Content-Type': contentType});
            res.end(data);
        }
    });
});

server.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
    openBrowser('http://localhost:3000');
});

function openBrowser(url) {
    var cmd;
    var args = [];

    switch (process.platform) {
        case "win32":
            cmd = "cmd";
            args = ["/c", "start"];
            break;
        case "darwin":
            cmd = "open";
            break;
        default:
            cmd = "xdg-open";
    }
    args.push(url);
    exec(cmd + ' ' + args.join(' ')); // Exécute la commande système pour ouvrir l'URL dans le navigateur
}