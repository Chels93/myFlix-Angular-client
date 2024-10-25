import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');

  // Set the view engine to use ngExpressEngine
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from the /browser folder
  server.get('**/*.*', express.static(browserDistFolder, {
    maxAge: '1y',
  }));

  // All regular routes use the Angular Universal engine
  server.get('**', (req, res, next) => {
    const { baseUrl } = req;

    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    }, (err, html) => {
      if (err) {
        return next(err);
      }
      res.send(html);
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000; // Default port
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Check if this file is executed directly
if (process['argv'][1] === fileURLToPath(import.meta.url)) {
  run();
}
